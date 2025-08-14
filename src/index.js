import { ApolloServer, gql } from "apollo-server";

const persons = [
    {
        nombre: "Jesus",
        apellidos: { primero: "Gomez", segundo: "Medina" },
        telefono: 687121212,
        ciudad: "Guasave",
        direccion:"Centro",
        id: "1111-1111-111-111",
        age:18
    },
    {
        nombre: "Rafael",
        apellidos: { primero: "Ceja", segundo: "Chicuate" },
        telefono: 687121212,
        ciudad: "Guasave",
        direccion:"Rancho",
        id: "11123-1111-111-111",
        age:29
    },
    {
        nombre: "Jose",
        apellidos: { primero: "Gomez", segundo: "Medina" },
        telefono: 687121212,
        ciudad: "Guasave",
        direccion:"Mar",
        id: "1112-1111-111-111",
        age:17,
        activo:true
    },
    {
        nombre: "Noe",
        apellidos: { primero: "Diaz", segundo: "Gallardo" },
        //telefono: 687121212,
        ciudad: "Guasave",
        direccion:"Montañas",
        id: "1112-1111-111-111",
        age:15
    }
];

const typeDefinitions = gql`
  type Apellidos {
    primero: String!
    segundo: String!
  }

  type Persona {
    nombre: String!
    apellidos: Apellidos!
    telefono: Int!
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
    allPersons: [Persona]!
    findPerson(name: String!): Persona
  }
`;

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) => {
            const { name } = args;
            return persons.find(
                persona => persona.nombre.trim().toLowerCase() === name.trim().toLowerCase()
            );
        }
    },
    Persona: {
  ubicacion: (root) => `${root.direccion}, ${root.ciudad}`,
  check: () => "Listo",
  puedeBeber: (root) => root.age >= 18,
  hasPhone: (root) => root.telefono !== null && root.telefono !==undefined,
  activo: (root) => root.activo !== null && root.activo !== undefined ? root.activo : false,
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
