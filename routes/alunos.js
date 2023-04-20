
const Aluno = require("../database/aluno");
const Turma = require("../database/turma");

const { Router } = require("express");
const router = Router();

/**
 *  @swagger
 *  /alunos:
 *   get:
 *     summary: Retorna uma lista de alunos
 *     description: Retorna uma lista de todos os alunos cadastrados na base de dados.
 *     tags: [Alunos] 
 *     responses:
 *       200:
 *         description: Retorna a lista de alunos
 *       500:
 *         description: Erro interno no servidor
 */
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

/**
 *  @swagger
 *  /alunos{id}:
 *   get:
 *     summary: Retorna o aluno através do id
 *     description: Retorna o aluno por id através do params
 *     tags: [Alunos] 
 *     responses:
 *       200:
 *         description: Retorna o aluno solicitado
 *       404:
 *         description: Aluno não encontrado
 */
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

/**
 *  @swagger
 *  /alunos:
 *   post:
 *     summary: Cria um novo aluno
 *     description: Cria novo aluno através do body
 *     tags: [Alunos] 
 *     requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *             $ref: '#/components/schemas/Aluno' 
 *     responses:
 *       200:
 *         description: Aluno criado
 *       500:
 *         description: Um erro aconteceu
 */
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

/**
 *  @swagger
 *  /alunos{id}:
 *   put:
 *     summary: Atualiza aluno pelo id
 *     description: Retorna o aluno atualizado pelo id.
 *     tags: [Alunos]
 *     responses:
 *       200:
 *         description: Aluno editado com sucesso!
 *       404:
 *         description: Aluno não encontrado
 */
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

/**
 *  @swagger
 *  /alunos{id}:
 *   delete:
 *     summary: Deleta um aluno pelo id
 *     description: Deleta aluno pelo id
 *     tags: [Alunos]
 *     responses:
 *       200:
 *         description: Aluno removido com sucesso
 *       404:
 *         description: Aluno não encontrado
 */
router.delete("/alunos/:id", async (req, res) => {
    const { id } = req.params;
    const aluno = await Aluno.findOne({ where: { id } });

    try {
        if(aluno) {
            await aluno.destroy();
            res.status(200).json({ message: "Aluno removido com sucesso" });
        } else {
            res.status(404).json({ error: "Aluno não encontrado" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu" });
    }
});


module.exports = router;