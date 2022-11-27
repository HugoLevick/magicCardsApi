import Express from "express";

const app = Express();
const puerto = 3000;

app.get("/", function (req, res) {
  res.send("¡Hola Mundo!");
});

app.listen(puerto, () => {
  console.log(`Api corriendo en puerto: ${puerto}`);
});
