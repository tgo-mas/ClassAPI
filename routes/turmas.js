const Turma = require("../database/turma");
const Professor = require ("../database/professor");

const { Router } = require("express");

// Criação do grupo de rotas
const router = Router();

/**
 *  @swagger
 *  /turmas:
 *   get:
 *     summary: Retorna turmas
 *     description: Retorna as turmas por filtro
 *     tags: [Turmas] 
 *     responses:
 *       200:
 *         description: Resultado das turmas
 *       404:
 *         description: Não foram encontradas turmas com o filtro escolhido
 */

router.get("/turmas", async (req, res) => {

    const { serie, turno } = req.query;
    const listaTurmas = await Turma.findAll();
    let result = [];

    if(serie){
        result = listaTurmas.filter(
            value => value.serie.includes(serie)
        );
    }else if(turno){
        result = listaTurmas.filter(
            value => value.turno.includes(turno)
        );
    }else{
        res.json(listaTurmas);
        return;
    }

    if(result !== []){
        res.json(result);
    }else{
        res.status(404).json("Não foram encontradas turmas com o filtro escolhido!");
    }
});

/**
 *  @swagger
 *  /turmas{id}:
 *   get:
 *     summary: Retorna a turma através do id
 *     description: Retorna a turma por id através do params
 *     tags: [Turmas] 
 *     responses:
 *       200:
 *         description: Retorna a turma solicitada
 *       404:
 *         description: Turma não encontrada
 */

router.get("/turmas/:id", async (req,res) =>{
    const { id } = req.params;

    const turma = await Turma.findByPk(id);
    if(turma) {
        res.json(turma);
    }
    else{
        res.status(404).json({ message: "Turma não encontrada." })
    }
});

/**
 *  @swagger
 *  /turmas:
 *   post:
 *     summary: Cria uma nova turma
 *     description: Cria nova turma através do body
 *     tags: [Turmas] 
 *     requestBody:
 *     required: true
 *     responses:
 *       200:
 *         description: Retorna a turma
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Um erro aconteceu
 */

router.post("/turmas", async (req,res) =>{
    const { serie, turno, professorId } = req.body;

    try {
        const professor = await Professor.findByPk(professorId);
        if(professor) {
            const turma = await Turma.create (
                { serie, turno, professorId },
                { include: [Professor]}
            );
            res.json(turma);
        }
        else {
            res.status(404).json({ message: "Professor não encontrado." })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu."})
    }
});

/**
 *  @swagger
 *  /turmas{id}:
 *   put:
 *     summary: Atualiza turma pelo id
 *     description: Retorna a turma atualizada pelo id.
 *     tags: [Turmas]
 *     responses:
 *       200:
 *         description: Turma editada
 *       404:
 *         description: Turma não encontrada
 */

router.put("/turmas/:id", async (req, res) =>{
    const { serie, turno } = req.body;
    
    const turma = await Turma.findByPk(req.params.id);

    try {
        if(turma) {
            await Turma.update(
                { serie, turno },
                { where: { id: req.params.id } }
            );
            res.json({ message: "Turma editada." })
        }
        else{
            res.status(404).json ({ message: "Turma não encontrada." })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json ({ message: "Um erro aconteceu." })
    }
});

/**
 *  @swagger
 *  /turmas{id}:
 *   delete:
 *     summary: Deleta a turma pelo id
 *     description: Deleta turma pelo id
 *     tags: [Turmas]
 *     responses:
 *       200:
 *         description: Turma removida
 *       404:
 *         description: Turma não encontrada
 */

router.delete("/turmas/:id", async(req, res) => {
    const turma = await Turma.findByPk(req.params.id);

    try {
        if(turma) {
            await turma.destroy();
            res.json ({ message: "Turma removida."});
        }
        else{
            res.status(404).json({ message: "Turma não encontrada"})
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json ({message: "Um erro aconteceu."})
    }
})

module.exports = router;