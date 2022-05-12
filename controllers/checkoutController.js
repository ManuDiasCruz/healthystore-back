import db from "./../db.js"

export async function postCheckout(req, res) {
    console.log("postcheckout")
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    try {
        const contains = await db.collection("bag").find({token}).toArray();
        console.log(contains)
        if(!contains){
            res.status(404).send("Verifique se todos os prdutos estão disponíveis");
            return;
        }
        await db.collection("orders").insertMany(contains);
        res.status(201).send('Produto salvo');
    } catch (err) {
        res.status(500).send('Erro interno do servidor' + err);
    }
}

export async function getCheckout(req, res) {
    console.log("getcheckout")
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    try {
        const contains = await db.collection("orders").find({token}).toArray();
        if(!contains){
            res.status(404).send("Não há pedidos");
            return;
        }
        res.status(201).send(contains);
    } catch (err) {
        res.status(500).send('Erro interno do servidor');
    }
}