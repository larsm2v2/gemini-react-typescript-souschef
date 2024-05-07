import express, { Request, Response } from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";


const PORT = 8000;
const app = express();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY ?? "");

interface ChatHistory {
  history: string[];
}

interface ChatMessage {
  message: string;
  history: InputContent[];
}

type InputContent = {
  parts: string;
  role: string;
};

app.post("/gemini", async (req: Request<{}, {}, ChatMessage, ChatHistory>, res: Response) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: req.body.history
  });
  const msg = req.body.message;
  const result = await chat.sendMessageStream(msg);
  const response = await result.response;
  const text = response.text();
  res.send(text);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));