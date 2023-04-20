
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
const rotasTurmas= require("./routes/turmas");


//TODO: Chamar banco de dados { authenticate, connection }

//TODO: Chamar rotas (require) e (app.use())
app.use(rotasAlunos);

app.use(rotasTurmas);

const rotasProfessores= require("./routes/professores");

app.use(rotasProfessores);


app.listen(3000, () => {
    connection.sync(
        { force: true }
    );
    console.log("Servidor rodando em http://localhost:3000");
});
