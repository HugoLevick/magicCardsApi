import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import mysql from "mysql2";
import querydb from "./src/query.js";
import Card from "./src/card.class.js";
import bodyParser from "body-parser";
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
const puerto = process.env.PORT;

let cards = [];

app.get("/seed", (req, res) => {
  try {
    connection.query(`TRUNCATE ${process.env.DB_NAME}.cartas`, async (err) => {
      if (err) throw err;
      let sql = `INSERT INTO ${process.env.DB_NAME}.cartas (id, numero, nombre, rareza, texto, tipo) VALUES`;
      const response = await fetch("https://api.magicthegathering.io/v1/cards?limit=5");
      let data = await response.json();
      for (let card in data.cards) {
        card = data.cards[card];
        sql += `(UUID(), ${card.number.replace("★", ".5")}, "${card.name}", "${card.rarity}", "${card.text}", "${card.type}"),`;
      }
      sql = sql.replace(/,$/, "");
      connection.query(sql, (err) => {
        if (err) throw err;
        res.send("Insercion completa");
      });
    });
  } catch (error) {
    console.log(error);
    res.send("Insercion fallida, consultar mensajes de consola");
  }
});

app
  .route("/cards")
  .get(async (req, res) => {
    const limit = +req.query.limit || 10;
    const offset = +req.query.offset || 0;
    const cards = await querydb(`SELECT * FROM ${process.env.DB_NAME}.cartas ORDER BY numero ASC LIMIT ${limit} OFFSET ${offset}`, connection);
    res.send({
      next: `/cards?limit=${limit}&offset=${offset + limit}`,
      previous: offset - limit >= 0 ? `/cards?limit=${limit}&offset=${offset - limit}` : undefined,
      result: cards,
    });
  })
  .post(async (req, res) => {
    try {
      const card = new Card(req.body.numero, req.body.nombre, req.body.tipo, req.body.rareza, req.body.texto);
      await querydb(`INSERT INTO ${process.env.DB_NAME}.cartas(id, numero, nombre, rareza, texto, tipo) VALUES(UUID(), ${card.numero}, '${card.nombre}', '${card.rareza}', '${card.texto}', '${card.tipo}')`, connection);
      res.send({ result: card });
    } catch (error) {
      console.log(error);
      res.send("No se pudo insertar la carta, consulta logs");
    }
  });

app
  .route("/cards/:numero")
  .get(async (req, res) => {
    if (req.params.numero !== "random") {
      const [card] = await querydb(`SELECT * FROM ${process.env.DB_NAME}.cartas WHERE numero = ${req.params.numero}`, connection);
      res.send({
        result: card,
      });
    } else {
      const [card] = await querydb(`SELECT * FROM ${process.env.DB_NAME}.cartas ORDER BY RAND() LIMIT 11`, connection);
      res.send({
        result: card,
      });
    }
  })
  .delete(async (req, res) => {
    try {
      await querydb(`DELETE FROM ${process.env.DB_NAME}.cartas WHERE numero = ${req.params.numero}`, connection);
      res.send({
        result: "Se borro la carta",
      });
    } catch (error) {
      console.log(error);
      res.send({ error: "No se pudo borrar la carta" });
    }
  });
app.listen(puerto, () => {
  console.log(`Api corriendo en puerto: ${puerto}`);
});
