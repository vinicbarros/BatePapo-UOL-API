import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

const app = express();

app.use(cors());
app.use(json());

const client = new MongoClient(process.env.MONGO_URI);

let db;

client.connect().then(() => {
  db = client.db("batepapouol");
});

app.get("/participants", async (req, res) => {
  try {
    const users = await db.collection("teste1").find().toArray();
    res.send(users);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/participants", async (req, res) => {
  const { name } = req.body;
  try {
    const user = await db.collection("teste1").insertOne({
      name,
      lastStatus: Date.now(),
    });
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(422);
  }
});

app.get("/messages", async (req, res) => {
  const { limit } = req.query;
  const { user } = req.headers;
  let aux = 0;
  if (limit < 0) limit = aux;
  try {
    const messages = await db.collection("teste2").find().toArray();
    const toUserMessages = messages.filter((msg) => {
      msg.to === user || msg.type === "message" || msg.from === user;
    });
    res.send(toUserMessages.slice(-limit));
  } catch (err) {
    res.sendStatus(409);
  }
});

app.listen(5000);
