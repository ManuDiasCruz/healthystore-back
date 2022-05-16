import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"

import db from "./../db.js"

export async function signUp(req, res){
    const {username, email, password, repeatedPassword} = req.body
    try {
        const user = await db.collection("users").findOne({email})
		if (user) return res.status(409).send(`Já existe uma conta com o email: ${email}.`)
        const SALT = 10
        const encryptedPassword = bcrypt.hashSync(password, SALT)
        await db.collection("users").insertOne({username, email, password: encryptedPassword})
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send("Error creatig new user.")
    }
}

export async function signIn(req, res){
    const {email, password} = req.body

    try {
        const user = await db.collection("users").findOne({email})
        if (!user) return res.sendStatus(404)

        if (user && bcrypt.compareSync(password, user.password)){
            const token = uuid()
            await db.collection("sessions").insertOne({token, userId: user._id})
            return res.send({token, name: user.username})
        } 
        res.sendStatus(404)
    } catch (error) {
        res.status(500).send("Error logging in user.")
    }
}

export async function signOut(req, res) {
    const {authorization} = req.headers

    const token = authorization?.replace("Bearer", "").trim()
    if(!token) return res.send(403)
    try {
      await db.collection("sessions").deleteOne({token})
      res.sendStatus(200)
    } catch (error) {
      return res.status(500).send("Error logging out.")
    }
  }