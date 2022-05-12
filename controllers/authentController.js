import joi from "joi"
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"

import db from "./../db.js"

export async function signUp(req, res){
    const {username, email, password, repeatedPassword} = req.body

    try {
        // There is already a registered user with this email
        const user = await db.collection("users").findOne({email})
		if (user) return res.status(409).send(`There is already a user with this ${email}.`)

        // Inserting the user
        const SALT = 10
        const encryptedPassword = bcrypt.hashSync(password, SALT)
        await db.collection("users").insertOne({username, email, password: encryptedPassword})
        res.sendStatus(201) // created
    } catch (error) {
        console.log("Error creating new user.", error)
        res.status(500).send("Error creatig new user.")
    }
}

export async function signIn(req, res){
    const {email, password} = req.body

    try {
        const user = await db.collection("users").findOne({email})
        if (!user) return res.sendStatus(404) // not found

        if (user && bcrypt.compareSync(password, user.password)){
            const token = uuid()
            await db.collection("sessions").insertOne({token, userId:user._id})
            return res.send({token, name: user.name})
        } 

        res.sendStatus(404)

    } catch (error) {
        console.log("Error logging in user.", error)
        res.status(500).send("Error logging in user.")
    }
}

export async function signOut(req, res) {
    const {authorization} = req.headers

    const token = authorization?.replace("Bearer", "").trim()
    if(!token) return res.send(403) // forbidden
    
    try {
      await db.collection("sessions").deleteOne({token})

      res.sendStatus(200)

    } catch (error) {
      console.log("Error logging out.", error)
      return res.status(500).send("Error logging out.")
    }
  }