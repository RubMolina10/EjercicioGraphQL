import { MongoClient } from "mongodb";

async function run() {
  const uri = "mongodb://localhost:27017"; // tu cadena de conexión
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db("testdb"); // nombre de tu base de datos
    const collection = database.collection("persons"); // nombre de la colección

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

    // Insertar todos los registros
    const result = await collection.insertMany(persons);
    console.log(`Se insertaron ${result.insertedCount} documentos`);
  } finally {
    await client.close();
  }
}

run().catch(console.error);
