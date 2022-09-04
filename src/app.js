import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import dayjs from "dayjs";
import joi from "joi";
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
    const users = await db.collection("users").find().toArray();
    res.send(users);
  } catch (error) {
    res.sendStatus(500);
  }
});

const userSchema = joi.object({
  name: joi.string().required(),
});

app.post("/participants", async (req, res) => {
  const { name } = req.body;
  const findUser = db.collection("users").findOne({ name: name });
  const validate = userSchema.validate(req.body, { abortEarly: false });

  if (validate.error) {
    const error = validate.error.details.map((detail) => detail.message);
    return res.status(422).send(error);
  } else if (await findUser) {
    return res.status(409).send("Esse usuário já está logado");
  }
  try {
    await db.collection("users").insertOne({
      name,
      lastStatus: Date.now(),
    });
    await db.collection("messages").insertOne({
      from: name,
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: dayjs(Date.now()).format("HH:mm:ss"),
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
    const messages = await db.collection("messages").find().toArray();
    const toUserMessages = messages.filter((msg) => {
      return (
        msg.to === user ||
        msg.type === "message" ||
        msg.from === user ||
        msg.to === "Todos"
      );
    });
    res.send(toUserMessages);
  } catch (err) {
    res.sendStatus(409);
  }
});

const msgSchema = joi.object({
  to: joi.string().required(),
  text: joi.string().required(),
  type: joi.string().valid("message", "private_message").required(),
});

app.post("/messages", async (req, res) => {
  const { user } = req.headers;
  const { to, text, type } = req.body;
  const isUserLogged = await db.collection("users").findOne({ name: user });
  const validate = msgSchema.validate(req.body, { abortEarly: false });

  if (validate.error) {
    const error = validate.error.details.map((detail) => detail.message);
    return res.status(422).send(error);
  } else if (!isUserLogged) {
    return res.status(409).send({ message: "O usuário não está logado!" });
  }

  try {
    await db.collection("messages").insertOne({
      to,
      text,
      type,
      from: user,
      time: dayjs(Date.now()).format("HH:mm:ss"),
    });
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(409);
  }
});

app.post("/status", async (req, res) => {
  const { user } = req.headers;
  const isUserLogged = await db.collection("users").findOne({ name: user });

  if (!isUserLogged) {
    return res
      .status(404)
      .send({ message: "O usuário não está na lista de participantes!" });
  }

  try {
    await db
      .collection("users")
      .updateOne({ name: user }, { $set: { lastStatus: Date.now() } });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(404);
  }
});

setInterval(async () => {
  const users = await db.collection("users").find().toArray();
  const filteredUsers = users.filter((user) => {
    return Date.now() - user.lastStatus > 10000;
  });
  filteredUsers.forEach(async (inactive) => {
    await db.collection("users").deleteOne({ _id: inactive._id });
    await db.collection("messages").insertOne({
      to: "Todos",
      text: "sai da sala...",
      type: "status",
      from: inactive.name,
      time: dayjs(Date.now()).format("HH:mm:ss"),
    });
  });
}, 15000);

app.delete("/messages/:ID_DA_MENSAGEM", async (req, res) => {
  const id = req.params.ID_DA_MENSAGEM;
  const { user } = req.headers;
  const userMessage = await db
    .collection("messages")
    .findOne({ _id: ObjectId(id) });
  if (!(userMessage.from === user)) {
    return res
      .status(401)
      .send({ message: "O usuário logado não é o dono da mensagem!" });
  }
  try {
    await db.collection("messages").deleteOne({ _id: ObjectId(id) });
    res.sendStatus(200);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.listen(5000);
