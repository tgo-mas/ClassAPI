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
    }
})
module.exports = Turma;
