const express = require('express')

const router = express.Router()

const tools = require('../data/tools.json')


// GET - LISTAR FERRAMENTAS
router.get('/', (req, res) => {
  res.json(tools)
})


// POST - CRIAR FERRAMENTA
router.post('/', (req, res) => {

  const newTool = req.body

  tools.push(newTool)

  res.status(201).json({
    message: 'Ferramenta criada',
    tool: newTool
  })

})


// PUT - ATUALIZAR FERRAMENTA
router.put('/:id', (req, res) => {

  // pega o ID da URL
  const id = Number(req.params.id)

  // pega os novos dados enviados
  const updatedData = req.body

  // procura ferramenta pelo ID
  const tool = tools.find(tool => tool.id === id)

  // verifica se encontrou
  if (!tool) {
    return res.status(404).json({
      message: 'Ferramenta não encontrada'
    })
  }

  // atualiza os dados
  Object.assign(tool, updatedData)

  // responde sucesso
  res.json({
    message: 'Ferramenta atualizada',
    tool
  })

})


// DELETE - REMOVER FERRAMENTA
router.delete('/:id', (req, res) => {

  const id = Number(req.params.id)

  const toolIndex = tools.findIndex(tool => tool.id === id)

  if (toolIndex === -1) {
    return res.status(404).json({
      message: 'Ferramenta não encontrada'
    })
  }

  tools.splice(toolIndex, 1)

  res.json({
    message: 'Ferramenta removida'
  })

})


module.exports = router