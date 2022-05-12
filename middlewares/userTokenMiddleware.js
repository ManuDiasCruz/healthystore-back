import db from "../db.js"

export async function validateUserToken(req, res, next){
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer", "").trim()
    console.log(token)

    if (!token) return res.status(401).send("No token.") // unauthorized

    try {
        const session = await db.collection("sessions").findOne({token})
        if (!session) return res.status(401).send("No session.") // unauthorized

        const user = await db.collection("users").findOne({_id: session.userId})
        if (!user) return res.status(401).send("No user found.") // unauthorized
        
        console.log(user)

        res.locals.user = user

        next()
    } catch (error){
        console.log("Error checking token.", error)
        res.status(500).send("Error checking token.")
    }
}