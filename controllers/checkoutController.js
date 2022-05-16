import db from "./../db.js"
import dayjs from "dayjs";

export async function postCheckout(req, res) {
    console.log("postcheckout")
    const { address, cpf, payment} = req.body;
    const { user } = res.locals;
    try {
        let informations = await db.collection("bag").find({ id: user._id }).toArray();
        if(!informations){
            res.status(404).send("Verifique se todos os prdutos estão disponíveis");
            return;
        }
        await db.collection("orders").insertMany([
            {
                ...{informations}, 
                address,
                cpf,
                payment,
                id: user._id,
                date: dayjs().format("DD/MM/YYYY"),
            }
        ]);
        await db.collection("bag").deleteMany({ id: user._id})
        res.status(201).send('Produto salvo');
    } catch (err) {
        res.status(500).send('Erro interno do servidor' + err);
    }
}

export async function getCheckout(req, res) {
    const { user } = res.locals;
    try {
        const contains = await db.collection("orders").find({ id: user._id }).toArray();
        if(!contains){
            res.status(404).send("Não há pedidos");
            return;
        }
        res.status(201).send(contains);
    } catch (err) {
        res.status(500).send('Erro interno do servidor');
    }
}