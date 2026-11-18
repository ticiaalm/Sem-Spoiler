const express = require('express')
const axios = require('axios')
const app = express()
const {v4: uuidv4} = require('uuid')
app.use(express.json())

const comentariosPorSerieId = {}

app.post('/series/:id/comentarios', async (req, res) => {
    const idCom = uuidv4()
    const { texto } = req.body

    const comentario = {
        id: idCom,
        texto: texto,
        serieId: req.params.id
    }
    const comentariosDaSerie = comentariosPorSerieId[req.params.id] || []
    comentariosDaSerie.push(comentario)
    comentariosPorSerieId[req.params.id] = comentariosDaSerie

    await axios.post('http://localhost:10000/eventos', {
        tipo: 'ComentarioCriado',
        dados: comentario
    })
    res.status(201).json(comentariosPorSerieId[req.params.id])
})

app.get('/series/:id/comentarios', (req, res) => {
    res.json(comentariosPorSerieId[req.params.id] || [])
})

app.post('/eventos', (req, res) => {
    try {
        const tipo = req.body
        console.log(tipo)
    } catch(e) {}
    res.end()
})

const port = 4100
app.listen(port, () => console.log(`Comentários. Porta ${port}.`))