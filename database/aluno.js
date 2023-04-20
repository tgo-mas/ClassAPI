
const { DataTypes } = require("sequelize");
const { connection } = require("./database");

const Aluno = connection.define("aluno", {
    nome: {
        type: DataTypes.STRING(130),
        allowNull: false,
        validate: {
            len: [3, 130] // valida que o valor tem entre 3 e 130 caracteres - VALIDAÇÃO SEQUELIZE
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            isEmail: true // valida se o valor é um email válido -VALIDAÇÃO SEQUELIZE
        }
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
