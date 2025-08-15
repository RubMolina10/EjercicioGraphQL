import { ApolloServer, UserInputError, gql } from "apollo-server"
import { v4 as uuidv4 } from 'uuid';

const persons = [
    {
        nombre: "Jesus",
        apellidos: { primero: "Gomez", segundo: "Medina" },
        telefono: 687121212,
        ciudad: "Guasave",
        direccion: "Centro",
        id: "1111-1111-111-111",
        age: 18
    },
    {
        nombre: "Rafael",
        apellidos: { primero: "Ceja", segundo: "Chicuate" },
        telefono: 687121212,
        ciudad: "Guasave",
        direccion: "Rancho",
        id: "11123-1111-111-111",
        age: 29
    },
    {
        nombre: "Jose",
        apellidos: { primero: "Gomez", segundo: "Medina" },
        telefono: 687121212,
        ciudad: "Guasave",
        direccion: "Mar",
        id: "1112-1111-111-111",
        age: 17,
        activo: true
    },
    {
        nombre: "Noe",
        apellidos: { primero: "Diaz", segundo: "Gallardo" },
        ciudad: "Guasave",
        direccion: "Montañas",
        id: "1112-1111-111-111",
        age: 15
    }
];

const typeDefinitions = gql`
enum YesNo {
    YES
    NO
}
  type Apellidos {
    primero: String!
    segundo: String!
  }

  input ApellidosInput {
    primero: String!
    segundo: String!
  }

  type Persona {
    nombre: String!
    apellidos: Apellidos!
    telefono: Int
    ciudad: String!
    direccion:String!
    ubicacion:String!
    check:String!
    id: ID!
    age:Int!
    puedeBeber:Boolean!
    hasPhone: Boolean!
    activo:Boolean
    hasActiveStatus: Boolean!
  }

  type Query {
    personCount: Int!
    allPersons(telefono:YesNo): [Persona]!
    findPerson(name: String!): Persona
  }

  type Mutation {
    addPerson(
      nombre: String!
      apellidos: ApellidosInput!
      telefono: Int  
      ciudad: String!
      direccion: String!
      age: Int!
    ): Persona
    editTelefono(
      nombre: String! 
      telefono: Int!
    ):Persona
  }
`;

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: (root, args) => {
            if (!args.telefono) return persons;

            if (args.telefono === "YES") {
                return persons.filter(p => p.telefono !== null && p.telefono !== undefined);
            } else {
                return persons.filter(p => p.telefono === null || p.telefono === undefined);
            }
        },
        findPerson: (root, args) => {
            const { name } = args;
            return persons.find(
                persona => persona.nombre.trim().toLowerCase() === name.trim().toLowerCase()
            );
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            if (persons.find(p => p.nombre.trim().toLowerCase() === args.nombre.trim().toLowerCase())) {
                throw new UserInputError("Ya existe una persona con ese nombre", {
                    invalidArgs: args.nombre
                });
            }
            const person = { ...args, id: uuidv4() }
            persons.push(person);
            return person;
        },
        editTelefono: (root, args) => {
            const index = persons.findIndex(
                p => p.nombre.trim().toLowerCase() === args.nombre.trim().toLowerCase()
            );
            //Se no existe la persona, retornamos null
            if (index === -1) return null;

            persons[index] = { ...persons[index], telefono: args.telefono };
            return persons[index];
        }
    },
    Persona: {
        ubicacion: (root) => `${root.direccion}, ${root.ciudad}`,
        check: () => "Listo",
        puedeBeber: (root) => root.age >= 18,
        hasPhone: (root) => root.telefono !== null && root.telefono !== undefined,
        activo: (root) => root.activo ?? false,
        hasActiveStatus: (root) => root.activo === true
    }
};

const server = new ApolloServer({
    typeDefs: typeDefinitions,
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`Server is running at ${url}`);
});
