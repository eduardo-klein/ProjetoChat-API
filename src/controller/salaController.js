const token = require("../util/token");
const usuarioModel = require("../model/usuarioModel");
const salaModel = require("../model/salaModel")

exports.get=async()=>{
    return await salaModel.listarSalas();
}

exports.entrar = async (_id, idUser)=>{

    const sala = await salaModel.listarSala(_id)
    let user = await usuarioModel.buscarUsuario(idUser);
    user.sala={_id:sala._id, nome:sala.nome, tipo:sala.tipo};
    if(await usuarioModel.alterarUsuario(user)){
        return {msg:"Ok", timestamp:timestamp=Date.now()};

    }
    return false;
}

exports.enviarMensagem = async (nick, msg, _id) =>
{
    const sala = await salaModel.listarSala(_id);

    var timestamp = Date.now();
    sala.msgs.push(
        {
            timestamp:timestamp,
            msg:msg,
            nick:nick
        }
    )
    let resp = await salaModel.atualizarMensagens(sala);

    return {"msg":"OK", "timestamp":timestamp};
}

exports.buscarMensagens = async (_id, timestamp)=>{
        const msgs = await salaModel.buscarMensagens(_id);
        if (msgs) {
            return {"status":200, msgs};
        }
        return [];
   
}


exports.sairSala = async (iduser, _id) =>{
        const sair = await salaModel.sairSala("usuarios", iduser);
        if(sair){
            return {"status":200, "msg":"ok"};
        }return {"msg":"Erro"};

}

exports.criarSala = async (data)=>{
    const sala = await salaModel.registrarSala(data)
    if(sala){
        return {"status":200, "msg":"ok"};
    }
    return {"msg":"erro"}
}
