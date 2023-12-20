const {MongoClient, ObjectId} = require("mongodb");
let singleton;

async function connect(){
    if (singleton) return singleton;
    const host = "mongodb+srv://Klein:senhamongodb@chat.nfqam6c.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(host, { useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();

    singleton = client.db(process.env.DB_DATABSE);
    return singleton;

}

async function findAll(collection){
    const db = await connect();
    return db.collection(collection).find().toArray();
}

async function insertOne(collection, objeto){
    const db = await connect();
    return db.collection(collection).insertOne(objeto);
}

let findOne = async (collection, _id)=>{
    const db = await connect();
    let obj= await db.collection(collection).find({'_id':new ObjectId(_id)}).toArray();
    if(obj)
      return obj[0];
    return false;
}
  

let updateOne = async (collection, object , param)=>{
    const db = await connect();
    let result =  await db.collection(collection).updateOne(param, {$set:object});
    return result;
}

let deleteOne = async (collection, filter)=>{
    const db = await connect();
    let result = await db.collection(collection).deleteOne(filter)
    return result;
}



let deleteObject = async (collection, object , param)=>{
    const unset = {$unset:object}
    const db = await connect();
    return await db.collection(collection).updateOne(param, unset);
}


let findOneAndUpdate = async (documentoId, atualizacao)=>{
    if(await deleteObject('usuarios', atualizacao, documentoId)){
        return true
    }else{
        return false
    }
}


/*let findOneAndUpdate = async (documentoId, atualizacao) =>{
    const filtroDocumento = { _id: new ObjectId(documentoId) };
  
    const resultado = await db.collection('usuarios').findOneAndUpdate(
      filtroDocumento,
      { $set: { sala: null }, $unset: { sala: 1 } },
      { returnDocument: 'after' }
    );
  
    if (resultado.value) {
      return resultado.value;
    } else {
      throw new Error('Nenhum documento encontrado com o ID fornecido.');
    }
  }*/
  




module.exports = {findAll, insertOne, findOne, updateOne, deleteOne, deleteObject, findOneAndUpdate}