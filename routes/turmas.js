const Turma = require("../database/turma");
const Professor = require ("../database/professor");

const { Router } = require("express");

// Criação do grupo de rotas

const router = Router();

router.get("/turmas", async (req, res) => {
    const listaTurmas = await Turma.findAll();
    res.json(listaTurmas);
});

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

router.post("/turmas", async (req,res) =>{
    const {serie, turno, professorId } = req.body;

    try {
        const professor = await Professor.findByPk(professorId);
        if(professor) {
            const turma = await Turma.create ({ serie, turno, professorId })
        }
        else {
            res.status(404).json({ message: "Turma não encontrada." })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu."})
    }
});

router.put("/turmas/:id", async (req, res) =>{
    const { serie, turno, professorId} = req.body;
    
    const turma = await Turma.findByPk(req.params.id);

    try {
        if(turma) {
            await Turma.update(
                { serie, turno, professorId},
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
})

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