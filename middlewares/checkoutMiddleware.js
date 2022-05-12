import db from "./../db.js"

export async function postCheckoutMiddle(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    try {
        const tokenValidation = await db.collection("users").findOne({token}); //Verificar o nome que a Manu escolheu para a coleção
        if(!tokenValidation){
            res.status(401).send('Token invalido');
            return;
        }
    } catch (err) {
        res.status(500).send('Erro interno do servidor');
    }
    next();
}

export async function getCheckoutMiddleware(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    try {
        const tokenValidation = await db.collection("users").findOne({token}); //Verificar o nome que a Manu escolheu para a coleção
        if(!tokenValidation){
            res.status(401).send('Token invalido');
            return;
        }
    } catch (err) {
        res.status(500).send('Erro interno do servidor');
    }
    next();
}