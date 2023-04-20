const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Escola",
            version: "0.1.0",
            description:
            "API para gerenciamento de Escola",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Squad 12",
                url: "https://github.com/tgo-mas/ClassAPI.git",
            },
        },
        servers: [
    {
        url: "http://localhost:3000",
    },
        ],
    },
    apis:["./routes/*.js"],
    tags: [
        {
            name: "Alunos",
            description:"Rotas de alunos",
        },
        {
            name: "Professores",
            description:"Rotas de professores",

        }
    ],
    };

    const specs = swaggerJsdoc(options);

    module.exports = function(app) {
        app.use(
            "/api-docs", 
            swaggerUi.serve, 
            swaggerUi.setup(specs, { explorer: true})
        );    
    } 