require("dotenv").config();
const app = require("../src/api.js");

app.use((req,res,next)=>{
    next();

});

let port = process.env.API_PORT|| 3001;
app.listen(port);

console.log(`listening on ${port}`);

