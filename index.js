import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config()

const mongoClient = new MongoClient(process.env.MONGO_URL);
let database = null;

//---------------------POST /BAG --------------

// 1.Recebe o nome do produto que a pessoa deseja adicionar a sacola e o token;
// 2.Verifica se está recebendo alguma coisa no body;
// 3.Verifica o header -> se possui um cadastro com o token;
// 4.Verifica se o produto existe na coleção products;
// 5.Adiciona as informações desse produto tiradas da coleção products + token enviado a coleção bag;

const nameSchema = joi.object({
    name: joi.string()
        .required()
})

app.post('/bag', async (req, res) => {
    const { authorization } = req.headers;
    const productName = req.body.name;
    const token = authorization?.replace('Bearer ', '');
    const validation = nameSchema.validate({name: productName});
    if(validation.error){
        res.status(422).send("Insira um nome válido");
        return;
    }
    try {
        await mongoClient.connect();
        database = mongoClient.db(process.env.DATABASE);
        const tokenValidation = await database.collection("users").findOne({token}); //Verificar o nome que a Manu escolheu para a coleção
        if(!tokenValidation){
            res.status(401).send('Token invalido');
            return;
        }
        const contains = await database.collection("products").findOne({name: productName});
        if(!contains){
            res.status(404).send("Esse produto não está disponível");
            mongoClient.close();
            return;
        }
        const { name, description, value } = contains;
        const chosenProduct = {
            name,
            description,
            value,
            token
        }
        await database.collection("bag").insertOne(chosenProduct);
        console.log(chosenProduct)
        res.status(201).send('Produto salvo');
    } catch (err) {
        res.status(500).send('Erro interno do servidor' + err);
    }
        mongoClient.close();
})


// -------------------GET /BAG-----------------------

// 1. Recebe o token associado ao usuário vindo do header;
// 2. Valida o token e verifica se existe o token na coleção users;
// 3. Busca os produtos escolhidos pelo token do usuário;
// 4. Envia para o front.

app.get('/bag', async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    try {
        await mongoClient.connect();
        database = mongoClient.db(process.env.DATABASE);
        const tokenValidation = await database.collection("users").findOne({token}); //Verificar o nome que a Manu escolheu para a coleção
        if(!tokenValidation){
            res.status(401).send('Token invalido');
            return;
        }
        const selectedProducts = await database.collection("bag").find({token}).toArray(); 
        res.status(201).send(selectedProducts);
    } catch (err) {
        res.status(500).send('Erro interno do servidor');
    }
    mongoClient.close();
})

// -------------------POST /CHECKOUT-----------------------

// 1. Recebe o token associado ao usuário vindo do header e o nome do produto vindo do body;
// 2. Valida o token e confere se tem um user associado a ele;
// 3. Busca os produtos escolhidos pelo token do usuário na coleção bag;
// 4. Salva na coleção checkout as informações do produto + token

app.post('/checkout', async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    try {
        await mongoClient.connect();
        database = mongoClient.db(process.env.DATABASE);
        const tokenValidation = await database.collection("users").findOne({token}); //Verificar o nome que a Manu escolheu para a coleção
        if(!tokenValidation){
            res.status(401).send('Token invalido');
            return;
        }
        const contains = await database.collection("bag").find({token}).toArray();
        if(!contains){
            res.status(404).send("Verifique se todos os prdutos estão disponíveis");
            mongoClient.close();
            return;
        }
        await database.collection("orders").insertMany(contains);
        console.log(contains);
        res.status(201).send('Produto salvo');
    } catch (err) {
        res.status(500).send('Erro interno do servidor');
    }
    mongoClient.close();
})

// -------------------GET /CHECKOUT-----------------------

// 1. Recebe o token associado ao usuário vindo do header e o nome do produto vindo do body;
// 2. Valida o token e confere se tem um user associado a ele;
// 3. Busca os produtos comprados pelo token do usuário na coleção orders;
// 4. Devolver os produtos comprados pelo usuário

app.get('/checkout', async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    try {
        await mongoClient.connect();
        database = mongoClient.db(process.env.DATABASE);
        const tokenValidation = await database.collection("users").findOne({token}); //Verificar o nome que a Manu escolheu para a coleção
        if(!tokenValidation){
            res.status(401).send('Token invalido');
            return;
        }
        const contains = await database.collection("orders").find({token}).toArray();
        if(!contains){
            res.status(404).send("Não há pedidos");
            mongoClient.close();
            return;
        }
        res.status(201).send(contains);
    } catch (err) {
        res.status(500).send('Erro interno do servidor');
    }
    mongoClient.close();
})



app.listen(process.env.DOOR, () => {
    console.log(`|--------------------------------------|`);
    console.log(`| Running at https://localhost:${process.env.DOOR}    |`);
    console.log(`|--------------------------------------|`);
});