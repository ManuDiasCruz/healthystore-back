import db from "../db.js"
import { schema } from "../schemas/nameSchema.js";
import { ObjectId } from "mongodb";

export async function postBagMiddleware(req, res, next) {
    console.log("middlewares")
    const { authorization } = req.headers;
    const { productName, quantity } = req.body;
    const token = authorization?.replace('Bearer ', '');
    const validation = schema.validate({name: productName, quantity});
    if(validation.error){
        res.status(422).send("Insira um nome válido");
        return;
    }
    try {
        const tokenValidation = await db.collection("users").findOne({token}); //Verificar o nome que a Manu escolheu para a coleção
        if(!tokenValidation){
            res.status(401).send('Token invalido');
            return;
        }
    } catch (err) {
        res.status(500).send('Erro interno do servidor' + err);
    }
    next();
}

export async function getBagMiddleware(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    try {
        const tokenValidation = await db.collection("users").findOne({token}); //Verificar o nome que a Manu escolheu para a coleção
        if(!tokenValidation){
            res.status(401).send('Token invalido');
            return;
        }
    } catch (err) {
        res.status(500).send('Erro interno do servidor' + err);
    }
    next();
}

export async function deleteBagMiddleware(req, res, next) {
    const id = new ObjectId(req.params.id);
    try {
        const validateId = await db.collection("bag").findOne({_id: id})
        if(!validateId){
            res.status(401).send('Token invalido');
            return;
        }
    } catch (error) {
        res.status(500).send('Erro interno do servidor');
    }
    next();
}