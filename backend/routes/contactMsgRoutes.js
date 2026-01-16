import express from "express"
import { sendMessage } from "../controllers/contactMsgController.js"

const router = express.Router()

// PUBLIC
router.post("/", sendMessage)

export default router
