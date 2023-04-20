
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const swagger = require("./swagger")


const app = express();

app.use(express.json());
app.use(morgan("dev"));
swagger(app)

const { connection, authenticate } = require ("./database/database");
authenticate(connection);

//Definição de Rotas
const rotasAlunos = require("./routes/alunos");
app.use(rotasAlunos);

const rotasProfessores= require("./routes/professores");
app.use(rotasProfessores);



app.listen(3000, () => {
    connection.sync();
    console.log("Servidor rodando em http://localhost:3000");
});
