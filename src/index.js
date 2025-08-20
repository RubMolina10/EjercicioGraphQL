import { ApolloServer, UserInputError, gql } from "apollo-server";
import { MongoClient, ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";

// 🔗 Conexión a Mongo
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let personsCollection;

async function connectDB() {
  await client.connect();
  const db = client.db("testdb");
  personsCollection = db.collection("persons");
  console.log("✅ Conectado a MongoDB");
}
connectDB();

// ================== TYPEDEFS ==================
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
    direccion: String!
    ubicacion: String!
    check: String!
    id: ID!
    age: Int!
    puedeBeber: Boolean!
    hasPhone: Boolean!
    activo: Boolean
    hasActiveStatus: Boolean!
  }

  type Query {
    personCount: Int!
    allPersons(telefono: YesNo): [Persona]!
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
    editTelefono(nombre: String!, telefono: Int!): Persona
  }
`;

// ================== RESOLVERS ==================
const resolvers = {
  Query: {
    personCount: async () => await personsCollection.countDocuments(),

    allPersons: async (root, args) => {
      if (!args.telefono) return await personsCollection.find().toArray();

      if (args.telefono === "YES") {
        return await personsCollection
          .find({ telefono: { $ne: null } })
          .toArray();
      } else {
        return await personsCollection.find({ telefono: null }).toArray();
      }
    },

    findPerson: async (root, args) => {
      const { name } = args;
      return await personsCollection.findOne({
        nombre: new RegExp(`^${name}$`, "i"),
      });
    },
  },

  Mutation: {
    addPerson: async (root, args) => {
      const existe = await personsCollection.findOne({
        nombre: new RegExp(`^${args.nombre}$`, "i"),
      });

      if (existe) {
        throw new UserInputError("Ya existe una persona con ese nombre", {
          invalidArgs: args.nombre,
        });
      }

      const person = { ...args, id: uuidv4() };
      await personsCollection.insertOne(person);
      return person;
    },

    editTelefono: async (root, args) => {
      const result = await personsCollection.findOneAndUpdate(
        { nombre: new RegExp(`^${args.nombre}$`, "i") },
        { $set: { telefono: args.telefono } },
        { returnDocument: "after" }
      );

      return result.value; // Si no existe regresa null
    },
  },

  Persona: {
    ubicacion: (root) => `${root.direccion}, ${root.ciudad}`,
    check: () => "Listo",
    puedeBeber: (root) => root.age >= 18,
    hasPhone: (root) => root.telefono !== null && root.telefono !== undefined,
    activo: (root) => root.activo ?? false,
    hasActiveStatus: (root) => root.activo === true,
  },
};

// ================== SERVER ==================
const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server listo en: ${url}`);
});
