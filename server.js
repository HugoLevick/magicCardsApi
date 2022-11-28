import express from "express";
import fetch from "node-fetch";
import Card from "./src/card.class.js";

const app = express();
app.use(express.static("public"));
const puerto = 3000;

let cards = [];

app.get("/seed", async (req, res) => {
  try {
    const response = await fetch("https://api.magicthegathering.io/v1/cards");
    let data = await response.json();

    for (let card in data.cards) {
      card = data.cards[card];
      cards.push(new Card(card.number, card.name, card.types, card.rarity, card.text));
    }
    res.send("Semilla ejecutada");
  } catch (error) {
    res.send("Semilla fallida");
  }
});

app.route("/cards").get((req, res) => {
  res.send(cards);
});

app.listen(puerto, () => {
  console.log(`Api corriendo en puerto: ${puerto}`);
});
