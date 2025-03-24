# Curso de GraphQL

¡Bienvenidos al curso de GraphQL! En este curso, aprenderás a construir y consumir APIs utilizando GraphQL con Apollo Server. Vamos a trabajar con un servidor local y una base de datos simulada para que puedas practicar y entender los conceptos fundamentales de GraphQL.

## Contenido del Proyecto

Este proyecto incluye los siguientes archivos principales:

- `index.ts`: El archivo principal que configura y arranca el servidor Apollo.
- `db.json`: Una base de datos simulada que contiene datos de ejemplo.
- `query.graphql`: Archivo para realizar consultas y mutaciones a la API GraphQL.

## Requisitos

Para seguir este curso, necesitarás tener instalado:

- [Node.js](https://nodejs.org/)
- [Bun](https://bun.sh/) (opcional, si prefieres usar Bun en lugar de Node.js)

## Instalación

1. Clona este repositorio en tu máquina local.
2. Navega al directorio del proyecto.
3. Instala las dependencias utilizando Bun o npm:

   ```bash
   bun install
   # o
   npm install
   ```

## Archivos Principales

### `index.ts`

Este archivo configura y arranca el servidor Apollo. Aquí definimos los tipos de GraphQL, los resolvers y las funciones para interactuar con la base de datos simulada.

#### Tipos de GraphQL

Definimos los tipos de GraphQL en el esquema, incluyendo `Person`, `Address`, y las consultas y mutaciones disponibles.

#### Resolvers

Los resolvers son funciones que manejan las consultas y mutaciones. En este archivo, tenemos resolvers para:

- Obtener el conteo de personas (`personCount`)
- Obtener todas las personas, con opción de filtrar por si tienen teléfono (`allPersons`)
- Encontrar una persona por nombre (`findPerson`)
- Agregar una nueva persona (`addPerson`)
- Editar el número de teléfono de una persona (`editPhoneNumber`)

### `db.json`

Este archivo contiene datos de ejemplo para nuestra base de datos simulada. Aquí tienes algunos ejemplos de personas:

```json
{
  "persons": [
    {
      "name": "John",
      "phone": "+5412345678",
      "age": 35,
      "street": "Calle la Florida 234",
      "city": "Havana",
      "id": "asdasdas-8dd45w4-d4as-8dasd4d1"
    },
    {
      "name": "Jane",
      "age": 28,
      "phone": "+1 123 456 789",
      "street": "123 Main St",
      "city": "New York",
      "id": "b7d8f9e2-3c4d-4f5a-9b6e-7d8f9e2c4d5a"
    },
    {
      "name": "Rodolfo",
      "age": 45,
      "street": "Calle Mayor 45",
      "city": "Madrid",
      "id": "c9e8f7d6-5b4a-3c2d-1e0f-9d8e7f6c5b4a"
    },
    {
      "name": "Maria",
      "age": 32,
      "phone": "+54 11 2345 6789",
      "street": "Av. Corrientes 1234",
      "city": "Buenos Aires",
      "id": "d1e2f3g4-5h6i-7j8k-9l0m-1n2o3p4q5r6s"
    }
  ]
}
```

### `query.graphql`

Este archivo contiene ejemplos de consultas y mutaciones que puedes realizar a la API GraphQL. Aquí tienes algunos ejemplos:

#### Consultas

```graphql
# Obtener el conteo de personas
query {
  personCount
}

# Obtener todas las personas
query {
  allPersons {
    name
    age
    phone
    address {
      street
      city
    }
    birthYear
    isOfLegalAge
    id
  }
}

# Encontrar una persona por nombre
query {
  findPerson(name: "John") {
    name
    age
    phone
    address {
      street
      city
    }
    birthYear
    isOfLegalAge
    id
  }
}
```

#### Mutaciones

```graphql
# Agregar una nueva persona
mutation {
  addPerson(
    name: "Carlos"
    age: 30
    phone: "+54 11 9876 5432"
    street: "Av. Libertador 1234"
    city: "Buenos Aires"
  ) {
    name
    age
    phone
    address {
      street
      city
    }
    birthYear
    isOfLegalAge
    id
  }
}

# Editar el número de teléfono de una persona
mutation {
  editPhoneNumber(name: "John", phone: "+54 11 1111 2222") {
    name
    age
    phone
    address {
      street
      city
    }
    birthYear
    isOfLegalAge
    id
  }
}
```

## Iniciar el Servidor

Para iniciar el servidor Apollo, ejecuta el siguiente comando:

```bash
bun run index.ts
# o
node index.ts
```

El servidor estará disponible en `http://localhost:4000`.

## Contribuir

Si deseas contribuir a este proyecto, por favor, abre un issue o envía un pull request. ¡Toda ayuda es bienvenida!

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

¡Gracias por participar en este curso de GraphQL! Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarme.
