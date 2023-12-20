const db = require("./db.js");
const { mongoclient, ObjectId, timestamp } = require("mongodb");

async function listarSalas() {
  return await db.findAll("salas");
}

async function listarSala(_id) {
  return await db.findOne("salas", _id);
}

let buscarMensagens = async (_id, timestamp) => {
  let sala = await listarSala(_id);
  let msgs = sala.msgs;
  if (msgs) {
    msgs.forEach((msg) => {
      msgs.push(msg);
    });
    return msgs;
  }
  return [];
};

let atualizarMensagens = async (sala) => {
  return await db.updateOne("salas", sala, { _id: sala._id });
};

async function registrarSala(data) {
  return await db.insertOne("salas", data);
}

async function sairSala(collection, documentoId) {
  // Use o ObjectId para procurar o documento pelo ID
  const filtroDocumento = { _id: new ObjectId(documentoId) };

  // Use $unset para remover o campo 'sala'
  const atualizacao =  {sala: 1 };

  const result = await db.findOneAndUpdate(
    filtroDocumento,
    atualizacao
  );

  return result;
}

module.exports = {
  listarSalas,
  listarSala,
  buscarMensagens,
  atualizarMensagens,
  registrarSala,
  sairSala,
};
