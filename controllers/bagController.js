import db from "./../db.js"
import { ObjectId } from "mongodb";

export async function postBag(req, res) {
    console.log("postbag")
    const { productName, quantity } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    try {
        const contains = await db.collection("products").findOne({name: productName});
        if(!contains){
            res.status(404).send("Esse produto não está disponível");
            return;
        }
        const { name, description, value } = contains;
        const chosenProduct = {
            name,
            description,
            value,
            quantity,
            token
        }
        await db.collection("bag").insertOne(chosenProduct);
        res.status(201).send('Produto salvo');
    } catch (err) {
        res.status(500).send('Erro interno do servidor' + err);
    }
}

export async function getBag(req, res) {
    console.log("getbag")
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    try {
        const tokenValidation = await db.collection("users").findOne({token}); //Verificar o nome que a Manu escolheu para a coleção
        if(!tokenValidation){
            res.status(401).send('Token invalido');
            return;
        }
        const selectedProducts = await db.collection("bag").find({token}).toArray(); 
        res.status(201).send(selectedProducts);
    } catch (err) {
        res.status(500).send('Erro interno do servidor');
    }
}

export async function deleteBag(req, res) {
    console.log("deletebag")
    const id = new ObjectId(req.params.id);
    try {
        await db.collection("bag").deleteOne({_id: id});
        res.status(200).send("Produto apagado");
    } catch (error) {
        res.status(500).send('Erro interno do servidor');
    }
}