import db from "./../db.js"
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

export async function postBag(req, res) {
    console.log("postbag")
    const { productName, quantity } = req.body;
    const { user } = res.locals;
    try {
        const contains = await db.collection("products").findOne({ name: productName });
        if(!contains){
            res.status(404).send("Esse produto não está disponível");
            return;
        }
        const { name, value, image } = contains;
        const chosenProduct = {
            name,
            value,
            image,
            quantity,
            id: user._id
        }
        await db.collection("bag").insertOne(chosenProduct);
        res.status(201).send('Produto salvo');
    } catch (err) {
        res.status(500).send('Erro interno do servidor' + err);
    }
}

export async function getBag(req, res) {
    console.log("getbag")
    const { user } = res.locals;
    try {
        const selectedProducts = await db.collection("bag").find({ id: user._id }).toArray();
        const reverseProducts = selectedProducts.slice(0).reverse(); 
        res.status(201).send(reverseProducts);
    } catch (err) {
        res.status(500).send('Erro interno do servidor');
    }
}

export async function deleteBag(req, res) {
    console.log("deletebag")
    const id = new ObjectId(req.params.id);
    try {
        await db.collection("bag").deleteOne({ _id: id });
        res.status(200).send("Produto apagado");
    } catch (error) {
        res.status(500).send('Erro interno do servidor');
    }
}