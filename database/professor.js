// Definir os itens da tabela professor usando 
//Sequelize: nome, email, telefone, área de ensino.
// Lembrar: um professor tem apenas uma turma.


const { DataTypes } = require("sequelize");
const { connection } = require("./database.js")


const Professor = connection.define("professor", {

            nome: { 
                type: DataTypes.STRING(130),
                allowNull: false, 
                validate: {
                    len: [3, 130] // valida que o valor tem entre 3 e 130 caracteres - VALIDACAO SEQUELIZE
                }
            },
            email: {
                type: DataTypes.STRING(60),
                allowNull: false,
                unique:true,
                validate: {
                    isEmail: true // valida se o valor é um email válido -VALIDAÇÃO SEQUELIZE
                }
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

Professor.hasMany(Turma);
Turma.belongsTo(Professor);

module.exports = Professor;
