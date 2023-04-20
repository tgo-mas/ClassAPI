const Professor = require("../database/professor");
const Turma = require("../database/turma");


const { Router } = require("express");

const router = Router();


//Definição de Rotas

/**
 *  @swagger
 *  /professores:
 *   post:
 *     summary: Cria um novo professor
 *     description: Cria novo professor através do body
 *     tags: [Professores] 
 *     requestBody:
 *     required: true
 *     responses:
 *       200:
 *         description: Aluno criado
 *       500:
 *         description: Um erro aconteceu
 */

//Adicionar Professor--------------------------------

router.post("/professores", async (req, res) => {
  // Coletar os dados do req.body
  const { nome, email, telefone, areaDeEnsino } = req.body;

  try {
    // Dentro de 'novo' estará o o objeto criado
    const novo = await Professor.create(
      { nome, email, telefone, areaDeEnsino }
    );

    res.status(201).json(novo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

/**
 *  @swagger
 *  /professores:
 *   get:
 *     summary: Retorna uma lista de professores
 *     description: Retorna uma lista de todos os professores cadastrados na base de dados.
 *     tags: [Professores] 
 *     responses:
 *       200:
 *         description: Retorna a lista de professores
 *       500:
 *         description: Erro interno no servidor
 */
 
// Listar Professores ------------------------------------
router.get("/professores", async (req, res) => {

    const { nome, email, areaDeEnsino } = req.query;
    const listaProfessores = await Professor.findAll();
    let result = [];

    if(nome){
      result = listaProfessores.filter(
        value => value.nome.includes(nome)
      );
    }else if(email){
      result = listaProfessores.filter(
        value => value.email.includes(email)
      );
    }else if(areaDeEnsino){
      result = listaProfessores.filter(
        value => value.areaDeEnsino.includes(areaDeEnsino)
      )
    }else{
      // SELECT * FROM professores;
      res.json(listaProfessores);
      return;
    }

    if(result !== []){
      res.json(result);
    }else{
      res.status(404).json("Não foi encontrado professor com os filtros escolhidos!");
    }
});

  /**
 *  @swagger
 *  /professores{id}:
 *   get:
 *     summary: Retorna o professor através do id
 *     description: Retorna o professor por id através do params
 *     tags: [Professores] 
 *     responses:
 *       200:
 *         description: Retorna o professor solicitado
 *       404:
 *         description: Professor não encontrado
 */

// Professores por ID ---------------------------------
router.get("/professores/:id", async (req, res) => {
  // SELECT * FROM professores WHERE id = 1;
  const professor = await Professor.findOne({
    where: { id: req.params.id },
    include: [Turma], 
  });

  if (professor) {
    res.json(professor);
  } else {
    res.status(404).json({ message: "Professor não encontrado." });
  }
});

/**
 *  @swagger
 *  /professores{id}:
 *   put:
 *     summary: Atualiza professor pelo id
 *     description: Retorna o professor atualizado pelo id.
 *     tags: [Professores]
 *     responses:
 *       200:
 *         description: Professor editado!
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Um erro aconteceu
 */
 
// atualizar um professor
router.put("/professores/:id", async (req, res) => {
  // obter dados do corpo da requisão
  const {  nome, email, telefone, areaDeEnsino } = req.body;
  
  const { id } = req.params;
  try {
    
    const professor = await Professor.findOne({ where: { id } });

    if (professor) {
      
      // atualizar o professor 
      await professor.update({ nome, email, telefone, areaDeEnsino });
      res.status(200).json({ message: "Professor editado." });
    } else {
      res.status(404).json({ message: "Professor não encontrado." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

/**
 *  @swagger
 *  /professores{id}:
 *   delete:
 *     summary: Deleta um professor pelo id
 *     description: Deleta professor pelo id
 *     tags: [Professores]
 *     responses:
 *       200:
 *         description: Professor removido
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Um erro aconteceu
 */
 
// Excluir um professor
router.delete("/professores/:id", async (req, res) => {
  
  const { id } = req.params;
  
  const professor = await Professor.findOne({ where: { id } });
  try {
    if (professor) {
      await professor.destroy();
      res.status(200).json({ message: "Professor removido." });
    } else {
      res.status(404).json({ message: "Professor não encontrado." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

module.exports = router;