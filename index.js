 
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
// 3.Verifica se o produto existe na coleção products;
// 4.Adiciona as informações desse produto tiradas da coleção products + token eviado a coleção bag;

const nameSchema = joi.object({
    name: joi.string()
        .required()
})

app.post('/bag', async (req, res) => {
    const { authorization } = req.headers;
    const { name } = req.body;
    const validation = nameSchema.validate({name});
    const token = authorization?.replace('Bearer ', '');
    if(validation.error){
        res.status(422).send("Insira um nome válido");
        return;
    }
    try {
        await mongoClient.connect();
        database = mongoClient.db(process.env.DATABASE);
        const tokenValidation = await database.collection("signin").findOne({token}); //Verificar o nome que a Manu escolheu para a coleção
        if(!tokenValidation){
            res.status(401).send('Token invalido');
            return;
        }
        const contains = await database.collection("products").findOne({name});
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
        res.status(201).send('Produto salvo');
    } catch (err) {
        res.status(500).send('Erro interno do servidor');
    }
        mongoClient.close();
})

// ----------------------------------------------

app

app.listen(process.env.DOOR, () => {
    console.log(`|--------------------------------------|`);
    console.log(`| Running at https://localhost:${process.env.DOOR}    |`);
    console.log(`|--------------------------------------|`);
});