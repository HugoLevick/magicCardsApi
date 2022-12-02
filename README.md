# Magic Cards Api

Api para la obtención de tarjetas Magic.

Pasos para ejecutar en desarrollo:

1. Crear la carpeta donde se contendrá el proyecto.
2. Abrir una terminal dentro de esa carpeta.
3. Ejecutar los comandos:

```
git init
```

```
git remote add github https://github.com/HugoLevick/magicCardsApi.git
```

```
git pull github main
```

4. Ejecutar el comando:

```
npm install
```

5. Para correr el servidor, ejecutar:

```
npm run dev
```

6. ¡Listo! Puedes acceder a la api mediante `localhost:3000` en tu navegador

7. Es posible popular la base de datos haciendo una petición GET a: `localhost:3000/seed`

# Uso de la API

## Obtener todas las cartas

```
GET baseUrl/cards
```

## Obtener una carta en especifico

```
GET baseUrl/cards/(id)
```

## Crear una carta

El body debe de contener los siguientes elementos:

```
{
    numero: number,

    nombre: "string",

    tipos: [
        "string 1",
        "string 2",
    ],

    rareza: "string",

    texto: "string"
}
```

<font size = "2">_El numero es de tipo string debido a que algunas cartas contienen numeros con caracteres especiales_</font>

Hacer la peticion a:

```
POST baseUrl/cards
```

## Eliminar una carta en especifico

```
DELETE baseUrl/cards/(id)
```
