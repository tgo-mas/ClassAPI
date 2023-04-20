const Aluno = require("../database/aluno");
const Turma = require("../database/turma");

const { Router } = require("express");
const router = Router();


router.get("/alunos", async (req, res) => {
    const listaAlunos = await Aluno.findAll();
    res.json(listaAlunos);
});

router.get("/alunos/:id", async (req, res) => {
    const aluno = await Aluno.findOne({
        where: { id: req.params.id },
        include: [Turma],
    });
    if(aluno) {
        res.json(aluno);
    } else {
        res.status(404).json({ error: "Aluno não encontrado" });
    }
});

router.post("/alunos", async (req, res) => {
    const { nome, email, dataNasc, turma } = req.body;

    try {
        const alunoNovo = await Aluno.create({ nome, email, dataNasc, turma },
            { include: [Turma] }
        )
        res.status(201).json(alunoNovo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu" });
    }
});

router.put("/alunos/:id", async (req, res) => {
    const { nome, email, dataNasc, turmaId } = req.body;
    const { id } = req.params;

    try {
        const aluno = await Aluno.findOne({ where: { id } });

        if (aluno) {
            if (turmaId) {
                const turma = await Turma.findOne({ where: { id: turmaId } });
            if(turma) {
                await aluno.setTurma(turma);
            }    
            }
            await aluno.update({ nome, email, dataNasc });
            res.status(200).json({ message: "Aluno editado com sucesso" });
        } else {
            res.status(404).json({ error: "Aluno não encontrado" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu"});
    }
});

router.delete("/alunos/:id", async (req, res) => {
    const { id } = req.params;
    const aluno = await Aluno.findOne({ where: { id } });

    try {
        if(aluno) {
            await aluno.destroy();
            res.status(200).json({ message: "Aluno removido com sucesso" });
        } else {
            res.status(404).json({ error: "Aluno nõ encontrado" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu" });
    }
});


module.exports = router;