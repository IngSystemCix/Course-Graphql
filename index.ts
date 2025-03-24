import { ApolloServer, gql, UserInputError } from "apollo-server";
import axios from "axios";
import { v4 as uuid } from 'uuid';

/**
 * Interface que define las propiedades de una persona.
 */
interface PersonProps {
  name: string;
  age: number;
  phone?: string;
  street: string;
  city: string;
  id: string;
}

/**
 * Función para obtener los datos de las personas desde una API externa.
 * @returns {Promise<PersonProps[]>} - Una promesa que resuelve en un array de objetos PersonProps.
 */
const fetchPersons = async (): Promise<PersonProps[]> => {
  try {
    const { data } = await axios.get('http://localhost:3000/persons');
    return data;
  } catch (error) {
    console.error("Error fetching persons:", error);
    return [];
  }
};

/**
 * Definición de los tipos GraphQL.
 */
const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }
  type Address {
    street: String!
    city: String
  }
  type Person {
    name: String!
    age: Int!
    phone: String
    birthYear: String!
    address: Address!
    isOfLegalAge: String!
    id: ID!
  }
  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }
  type Mutation {
    addPerson(
      name: String!
      age: Int!
      phone: String
      street: String!
      city: String!
    ): Person
    editPhoneNumber(
      name: String!
      phone: String!
    ): Person
  }
`;

/**
 * Definición de los resolvers para las consultas y mutaciones de GraphQL.
 */
const resolvers = {
  Query: {
    /**
     * Resolver para obtener el conteo de personas.
     * @returns {Promise<number>} - El número total de personas.
     */
    personCount: async (): Promise<number> => {
      const persons = await fetchPersons();
      return persons.length;
    },
    /**
     * Resolver para obtener todas las personas, con opción de filtrar por si tienen teléfono.
     * @param {unknown} _ - Parámetro no utilizado.
     * @param {{ phone: 'YES' | 'NO' }} args - Argumentos de la consulta.
     * @returns {Promise<PersonProps[]>} - Un array de objetos PersonProps.
     */
    allPersons: async (_: unknown, args: { phone: 'YES' | 'NO' }): Promise<PersonProps[]> => {
      const persons = await fetchPersons();
      return args.phone
        ? persons.filter((p) => args.phone === 'YES' ? p.phone : !p.phone)
        : persons;
    },
    /**
     * Resolver para encontrar una persona por nombre.
     * @param {unknown} _ - Parámetro no utilizado.
     * @param {{ name: string }} args - Argumentos de la consulta.
     * @returns {Promise<PersonProps | undefined>} - La persona encontrada o undefined.
     */
    findPerson: async (_: unknown, args: { name: string }): Promise<PersonProps | undefined> => {
      const persons = await fetchPersons();
      return persons.find((p) => p.name === args.name);
    }
  },
  Mutation: {
    /**
     * Resolver para agregar una nueva persona.
     * @param {unknown} _ - Parámetro no utilizado.
     * @param {PersonProps} args - Argumentos de la mutación.
     * @returns {Promise<PersonProps>} - La nueva persona agregada.
     */
    addPerson: async (_: unknown, args: PersonProps): Promise<PersonProps> => {
      const persons = await fetchPersons();
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name
        });
      }
      const newPerson = { ...args, id: uuid() };

      // Guardar el nuevo usuario en la API
      await axios.post('http://localhost:3000/persons', newPerson);

      return newPerson;
    },
    /**
     * Resolver para editar el número de teléfono de una persona.
     * @param {unknown} _ - Parámetro no utilizado.
     * @param {{ name: string; phone: string }} args - Argumentos de la mutación.
     * @returns {Promise<PersonProps | null>} - La persona actualizada o null si no se encontró.
     */
    editPhoneNumber: async (_: unknown, args: { name: string; phone: string }): Promise<PersonProps | null> => {
      let persons = await fetchPersons();
      const index = persons.findIndex((p) => p.name === args.name);
      if (index === -1) return null;

      const updatedPerson = { ...persons[index], phone: args.phone };

      // Actualizar en la API
      await axios.put(`http://localhost:3000/persons/${updatedPerson.id}`, updatedPerson);

      return updatedPerson;
    }
  },
  Person: {
    /**
     * Resolver para calcular el año de nacimiento basado en la edad.
     * @param {Pick<PersonProps, 'age'>} root - El objeto PersonProps.
     * @returns {string} - El año de nacimiento.
     */
    birthYear: (root: Pick<PersonProps, 'age'>): string => {
      return (new Date().getFullYear() - root.age).toString();
    },
    /**
     * Resolver para determinar si la persona es mayor de edad.
     * @param {Pick<PersonProps, 'age'>} root - El objeto PersonProps.
     * @returns {string} - 'Yes, it is' si es mayor de edad, 'No, it is not' si no lo es.
     */
    isOfLegalAge: (root: Pick<PersonProps, 'age'>): string => {
      return root.age >= 18 ? 'Yes, it is' : 'No, it is not';
    },
    /**
     * Resolver para obtener la dirección de la persona.
     * @param {Pick<PersonProps, 'street' | 'city'>} root - El objeto PersonProps.
     * @returns {Pick<PersonProps, 'street' | 'city'>} - La dirección de la persona.
     */
    address: (root: Pick<PersonProps, 'street' | 'city'>): Pick<PersonProps, 'street' | 'city'> => {
      return {
        street: root.street,
        city: root.city
      };
    }
  }
};

/**
 * Función para iniciar el servidor Apollo.
 */
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  server.listen().then(({ url }) => {
    console.log(`🟢 Server ready at ${url}`);
  });
};

// Iniciar el servidor
startServer();
