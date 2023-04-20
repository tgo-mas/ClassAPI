const Professor = require("../database/professor");
const Turma = require("../database/turma");


const { Router } = require("express");

const router = Router();


//Definição de Rotas


//Adicionar Professor--------------------------------

router.post("/professores", async (req, res) => {
  // Coletar os dados do req.body
  const { nome, email, telefone, areaDeEnsino, turma} = req.body;

  try {
    // Dentro de 'novo' estará o o objeto criado
    const novo = await Professor.create(
      { nome, email, telefone, areaDeEnsino, turma},
      { include: [Turma] }
    );

    res.status(201).json(novo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});



// Listar Professores ------------------------------------
router.get("/professores", async (req, res) => {
    // SELECT * FROM professores;
    const listaProfessores = await Professor.findAll();
    res.json(listaProfessores);
  });


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


// atualizar um professor
router.put("/professores/:id", async (req, res) => {
  // obter dados do corpo da requisão
  const {  nome, email, telefone, areaDeEnsino, turma } = req.body;
  
  const { id } = req.params;
  try {
    
    const professor = await Professor.findOne({ where: { id } });
    
    if (professor) {
      
      if (turma) {
        await Turma.update(turma, { where: { professorId: id } });
      }
      // atualizar o professor 
      await professor.update({ nome, email, telefone });
      res.status(200).json({ message: "Professor editado." });
    } else {
      res.status(404).json({ message: "Professor não encontrado." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});




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