import express from "express"
import { OAuth2Client } from "google-auth-library"
import jwt from "jsonwebtoken"
import { config } from "dotenv"

const Router = express.Router()
config()

Router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body
    const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim()

    if (!googleClientId) {
      return res.status(500).json({ success: false, message: "Google client not configured" })
    }

    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required" })
    }

    const client = new OAuth2Client(googleClientId)

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId
    })

    const payload = ticket.getPayload()
    const user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    }
    const token = jwt.sign({ email: user.email},process.env.SECRET_KEY,{ expiresIn: "7d"})

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    })

    res.json({
      success: true,
      token,
      user
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({success: false,message: "Google login failed"})
  }

})

export default Router;