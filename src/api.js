var express = require("express");
var app = express();

const token = require("../src/util/token")
const salaController = require("./controller/salaController");
const usuarioModel = require("./model/usuarioModel");
const usuarioController = require("./controller/usuarioController");

app.use(express.urlencoded({extended : true}));
app.use(express.json());



const router = express.Router();
app.use('/', router.get('/', (req,res)=>{
    res.status(200).send("<h1>API - CHAT</h1>")

}))

app.use("/",router.get("/sobre", (req,res,next) =>{
    res.status(200).send({
        "nome":"API - CHAT",
        "versão":"0.1.0",
        "autor":"Eduardo Klein"

    })

}));
    //criar usuario e token
    app.use("/entrar", router.post("/entrar", async (req,res, next) =>{
        const usuarioController = require("../src/controller/usuarioController");
        let resp = await usuarioController.entrar(req.body.nick);
        res.status(200).send(resp);
    }))

    //usuario sair
    app.use("/sair", router.get("/sair", async (req,res) =>{
        if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))
            return res.status(401).send("Token inválido");
        const usuarioController = require("../src/controller/usuarioController");
        let resp = await usuarioController.sair(req.body.nick, req.body.token, req.body.idUser);
        res.status(200).send(resp);

    }))

    //----- Salas -------------------------------------------------
    //entrar na sala
    app.use("/sala/entrar", router.put("/sala/entrar", (async (req, res) => {
        if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))
            return res.status(401).send("Token inválido");
        let resp = await salaController.entrar(req.query._id, req.headers.iduser);
        res.status(200).send(resp);
    })))

    //sair da sala
    app.use("/sala/sair", router.put("/sala/sair", async (req,res)=>{
        if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))
            return res.status(401).send("Token inválido");
        let resp = await salaController.sairSala(req.headers.iduser, req.query._id);
        res.status(200).send(resp);

    }))

    //listar salas
    app.use("/salas",router.get("/salas",async (req, res)=>{
        if(await token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)){
            let resp = await salaController.get();
            res.status(200).send(resp);
        }else{
            res.status(400).send({msg:"Usuário não autorizado"});
        }
    }))

    //criar salas 
    app.use("/sala", router.post("/sala", async (req,res)=>{
        if(await token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)){
            let resp = await salaController.criarSala(req.body);
            res.status(200).send(resp);
        }else{
            res.status(400).send({msg:"Usuário não autorizado"});
        }
    }))
    //------ Mensagens -----------------------------------
    //mandar mensagem
    app.use("/sala/mensagem", router.post("/sala/mensagem"), async (req,res) =>{
        if(!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))
            return false;
        let resp = await salaController.enviarMensagem(req.headers.nick, req.body.msg, req.body._id);
        res.status(200).send(resp);
    })
    //ler mensagens da sala
    app.use("/sala/mensagens", router.get("/sala/mensagens", async (req,res)=>{
        if(!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))
        return false;
        let resp = await salaController.buscarMensagens(req.query._id, req.query.timestamp);
        res.status(200).send(resp);

    }))

    module.exports=app;