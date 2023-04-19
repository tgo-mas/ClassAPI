// Definir os itens da tabela professor usando 
//Sequelize: nome, email, telefone, área de ensino.
// Lembrar: um professor tem apenas uma turma.


const { DataTypes } = require("sequelize");
const { connection } = require("./database.js")


const Professor = connection.define("professor", {

            nome: { 
        type: DataTypes.STRING(130),
        allowNull: false, 
            },
            email: {
                type: DataTypes.STRING(60),
                allowNull: false,
                unique:true
            },
            telefone: {
                type: DataTypes.STRING(20),
                allowNull: false,        
            }, 
            areaDeEnsino: {
                type: DataTypes.STRING(100),
                allowNull: false,        
            }
});


// Relacionamento de Dados
// Professor:Turma (1:1)

const Turma = require("./turma.js")

Professor.hasOne(Turma);
Turma.belongsTo(Professor);



module.exports= Professor;
