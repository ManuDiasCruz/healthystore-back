 
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

// 1.Recebe o nome do produto que a pessoa deseja adicionar a sacola
// 2.Verifica se está recebendo alguma coisa no body;
// 3.Verifica se o produto existe na coleção products;
// 4.Adiciona as informações desse produto tiradas da coleção products a coleção bag

const nameSchema = joi.object({
    name: joi.string()
        .required()
})

app.post('/bag', async (req, res) => {
    const { name } = req.body;
    const validation = nameSchema.validate({name});
    if(validation.error){
        res.status(422).send("Insira um nome válido");
        return;
    }
    try {
        await mongoClient.connect();
        database = mongoClient.db(process.env.DATABASE);
        const contains = await database.collection("products").findOne({name});
        if(!contains){
            res.status(404).send("Esse produto não está disponível");
            mongoClient.close();
            return;
        }
        await database.collection("bag").insertOne(contains);
        res.status(201).send('Produto salvo');
    } catch (err) {
        res.status(500).send('Erro interno do servidor');
    }
        mongoClient.close();
})

// ----------------------------------------------



app.listen(DOOR, () => {
    console.log(`|--------------------------------------|`);
    console.log(`| Running at https://localhost:${DOOR} |`);
    console.log(`|--------------------------------------|`);
});