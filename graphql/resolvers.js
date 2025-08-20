import { UserInputError } from "apollo-server";
import { v4 as uuidv4 } from "uuid";
import { getCollection } from "../models/persona.js";
import { errorMessages, warningMessages } from "../messages/messages.js";

export const resolvers = {
  Query: {
    personCount: async () => {
      const collection = await getCollection();
      return collection.countDocuments();
    },
    allPersons: async (root, args) => {
      const collection = await getCollection();
      if (!args.telefono) return collection.find({}).toArray();
      if (args.telefono === "YES") return collection.find({ telefono: { $ne: null } }).toArray();
      return collection.find({ telefono: null }).toArray();
    },
    findPerson: async (root, args) => {
      const collection = await getCollection();
      return collection.findOne({ nombre: new RegExp(`^${args.name}$`, "i") });
    },
  },
  Mutation: {
    addPerson: async (root, args) => {
      const collection = await getCollection();
      const existe = await collection.findOne({ nombre: new RegExp(`^${args.nombre}$`, "i") });
      if (existe) throw new UserInputError(warningMessages.PERSON_ALREADY_EXISTS, { invalidArgs: args.nombre });

      const person = { ...args, id: uuidv4() };
      await collection.insertOne(person);
      return person;
    },
    editTelefono: async (root, args) => {
      const collection = await getCollection();
      const persona = await collection.findOne({ nombre: new RegExp(`^${args.nombre}$`, "i") });
      if (!persona) return null;

      await collection.updateOne({ nombre: persona.nombre }, { $set: { telefono: args.telefono } });
      persona.telefono = args.telefono;
      return persona;
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
