import { gql } from "apollo-server";

export const typeDefs = gql`
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
    telefono: String
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
      telefono: String
      ciudad: String!
      direccion: String!
      age: Int!
    ): Persona
    editTelefono(nombre: String!, telefono: String!): Persona
  }
`;
