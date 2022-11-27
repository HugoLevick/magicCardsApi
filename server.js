import express from "express";

const app = express();
app.use(express.static("public"));
const puerto = 3000;

app.listen(puerto, () => {
  console.log(`Api corriendo en puerto: ${puerto}`);
});
