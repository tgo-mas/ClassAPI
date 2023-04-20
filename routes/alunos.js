const Aluno = require("../database/aluno");
const Turma = require("../database/turma");

const { Router } = require("express");
const router = Router();


router.get("/alunos", async (req, res) => {
    const { nome, turma } = req.query;

    const listaAlunos = await Aluno.findAll();
    let result = [];

    if(nome && turma){
        result = listaAlunos.filter(
            value => value.nome.includes(nome) && Turma.findByPk(value.turmaId).serie.includes(turma)
        );
    }else if(nome){
        result = listaAlunos.filter(
            value => value.nome.includes(nome)
        );
    }else if(turma){
        result = listaAlunos.filter(
            value => value.turmaId === turma
        );
    }else{
        res.json(listaAlunos);
        return;
    }

    if(result !== []){
        res.json(result);
    }else{
        res.status(404).json("Não foi encontrado aluno com os filtros selecionados.");
    }
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
    const { nome, email, dataNasc, turmaId } = req.body;

    try {
        const turma = Turma.findByPk(turmaId);

        if(turma){
            const alunoNovo = await Aluno.create(
                { nome, email, dataNasc, turmaId },
                { include: [Turma] }
            );
            
            res.status(201).json(alunoNovo);
        }else{
            res.status(404).json("Turma não encontrada.");
        }
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