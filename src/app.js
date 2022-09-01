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

app.listen(5000);
