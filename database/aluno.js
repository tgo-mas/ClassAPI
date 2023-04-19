
const { DataTypes } = require("sequelize");
const { connection } = require("./database");

const Aluno = connection.define("aluno", {
    nome: {
        type: DataTypes.STRING(130),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    dataNasc: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
});

const Turma = require("./turma");

Turma.hasMany(Aluno);
Aluno.belongsTo(Turma);

module.exports = Aluno;
