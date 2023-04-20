const { DataTypes } = require("sequelize");
const { connection } = require("./database");

const Turma = connection.define("turma", {
    serie: {
        type: DataTypes.STRING(5),
        allowNull: false,
    },
    turno: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            isIn: [['manhã', 'tarde', 'noite']] // valida se o valor está em uma lista de opções válidas -VALIDAÇÃO SEQUELIZE
        }
    }
})

module.exports = Turma;
