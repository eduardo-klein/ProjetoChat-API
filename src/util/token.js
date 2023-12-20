const jwt = require("jsonwebtoken");

const setToken = async (id,key) =>{
    if(id){
        token = jwt.sign({id}, key ,{expiresIn: 28800})
        return token;
    }
    return false;
}

const checkToken = async (token, id, key) => {
    const tokenCheck = jwt.verify(token, key);
    return tokenCheck;
};

module.exports={
    checkToken,
    setToken

}
