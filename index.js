
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

const { connection, authenticate } = require ("./database/database");
authenticate(connection);

//Definição de Rotas
const rotasAlunos = require("./routes/alunos");

//TODO: Chamar banco de dados { authenticate, connection }

//TODO: Chamar rotas (require) e (app.use())
app.use(rotasAlunos);

app.listen(3000, () => {
    connection.sync();
    console.log("Servidor rodando em http://localhost:3000");
});
