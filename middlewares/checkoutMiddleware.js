import db from "./../db.js"
import { checkoutSignUpSchema } from "../schemas/checkoutSchema.js"

export async function postCheckoutMiddle(req, res, next) {
  console.log("checkout middle")
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
     if (!token) {
        return res.sendStatus(401);
      }
    const validation = checkoutSignUpSchema.validate(req.body);
    if(validation.error){
      res.status(422).send("Insira um nome válido");
      return;
  }
    try {
        const session = await db.collection("sessions").findOne({ token });
        if (!session) {
            res.status(401).send('Token invalido');
            return;
        }
        const user = await db.collection("users").findOne({ _id: session.userId });
          if (!user) {
            return res.sendStatus("Não foi possível achar um user com esses dados");
          }
          delete user.password;
          res.locals.user = user;
    } catch (err) {
        res.status(500).send('Erro interno do servidor' + err);
    }
    next();
}
export async function getCheckoutMiddleware(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '').trim();
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
        res.status(401).send('Token invalido');
        return;
    }
    const user = await db.collection("users").findOne({ _id: session.userId });
      if (!user) {
        return res.sendStatus("Não foi possível achar um user com esses dados");
      }
      delete user.password;
      res.locals.user = user;
  } catch (err) {
      res.status(500).send('Erro interno do servidor' + err);
  }
  next();
}