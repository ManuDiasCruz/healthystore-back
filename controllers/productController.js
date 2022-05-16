import db from "./../db.js"
import { ConnectionClosedEvent, ObjectId } from "mongodb";

export async function addProduct(req, res){
    console.log("AddProduct");
    try {
        const {name, description, value, category} = req.body;

        const thereIsProduct = await db.collection("products").findOne({name});
        if (thereIsProduct) 
            return res.status(409).send(`There is already a product with this '${name}'.`);

        await db.collection("products").insertOne(req.body);
        console.log("Item inserted at Products Database.");
        res.status(201).send("Item inserted at Products Database."); // created
    } catch (error) {
        console.log("Error inserting item at Products Database.", error);
        res.status(500).send("Error inserting item at Products Database.");
    }
}

export async function getProducts(req, res){
    console.log("GetProducts");
    try {
        const products = await db.collection("products").find().toArray();
        res.send(products);
    } catch (error) {
        console.log("Error getting items at Products Database.", error);
        res.status(500).send("Error getting items at Products Database.");
    }
}

export async function getProductsByCategory(req, res){
    const category = req.params.category;
    try {
        const products = await db.collection("products").find({category: category}).toArray();
        res.send(products);
        console.log(products)
    } catch (error) {
        res.status(500).send(`Error getting items at Products Database by ${category} category.`)
    }
}

export async function getProduct(req, res){
    const id = new ObjectId(req.params.productId);
    try {
        const products = await db.collection("products").findOne({ _id: id });
        res.send(products);
    } catch (error) {
        res.status(500).send(`Error getting product at Products Database.`)
    }
}