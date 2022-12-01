let next = "/cards/";
async function buscarUna() {
  const pokemon = await fetch(next).then((response) => response.json());
  next = pokemon.next;
  alert(JSON.stringify(pokemon));
}
