const divCarta = document.getElementById("carta");
const numero = document.getElementById("numero");
const tabla = document.getElementById("cuerpo-tabla");
const cartasDiv = document.getElementById("cuerpo-tabla");
const form = document.getElementById("crear-carta");

let posicion = "/cards/";

async function buscarUna() {
  //prettier-ignore
  const {result: carta} = await fetch("/cards/" + (numero.value || 1)).then(async (res) => await res.json());
  if (!carta) alert("No se encontro la carta");
  else mostrarCarta(carta);
}

async function azar() {
  const { result: carta } = await fetch("/cards/random").then(async (res) => await res.json());
  numero.value = carta.numero;
  mostrarCarta(carta);
}

function mostrarCarta(carta) {
  divCarta.innerHTML = `Numero: ${(carta.numero + "").replace(".5", "★")}<br>Nombre: ${carta.nombre}<br>Tipo: ${carta.tipo}<br>Rareza: ${carta.rareza}<br>Texto: ${carta.texto}`;
}

async function borrarCarta(numero) {
  await fetch("/cards/" + numero.replace("★", ".5"), { method: "DELETE" }).then(() => alert("Se borro la carta " + numero));
  obtenerTodas(posicion);
}

async function obtenerTodas(link) {
  const { result: cartas, next, previous } = await fetch(link ?? "/cards").then(async (res) => await res.json());
  posicion = link ?? "/cards";
  let tr, td;
  tabla.innerHTML = "";
  cartas.forEach((c) => {
    tr = document.createElement("tr");
    const carta = {
      numero: (c.numero + "").replace(".5", "★"),
      nombre: c.nombre,
      tipo: c.tipo,
      rareza: c.rareza,
      text: c.texto,
      borrar: c.id,
    };
    for (let e in carta) {
      // Por cada elemento en carta
      td = document.createElement("td");
      if (e === "borrar") {
        let botonBorrar = document.createElement("button");
        botonBorrar.setAttribute("onclick", `borrarCarta('${carta.numero}')`);
        botonBorrar.innerHTML = `Borrar ${carta.numero}`;
        td.appendChild(botonBorrar);
      } else {
        td.innerHTML = carta[e];
      }
      tr.appendChild(td);
    }

    tabla.appendChild(tr);
  });

  const btnNext = document.createElement("button");
  btnNext.setAttribute("onclick", `obtenerTodas('${next.replace("localhost:3000", "")}')`);
  btnNext.innerHTML = "Siguiente";

  const btnPrevious = document.createElement("button");
  btnPrevious.setAttribute("onclick", `obtenerTodas('${previous?.replace("localhost:3000", "")}')`);
  btnPrevious.innerHTML = "Anterior";

  if (previous) cartasDiv.appendChild(btnPrevious);
  cartasDiv.appendChild(btnNext);
}

async function crearCarta() {
  await fetch("/cards/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      numero: form.numero.value,
      nombre: form.nombre.value,
      tipo: form.tipo.value,
      rareza: form.rareza.value,
      texto: form.texto.value,
    }),
  });
  alert("Se agrego la carta " + form.numero.value);
  obtenerTodas(posicion);
}

obtenerTodas(posicion);
