const axios = require('axios')
const express = require('express')
const app = express()
const {v4: uuidv4} = require('uuid')
app.use(express.json())

const comentariosPorSerieId = {}

const funcoes = {
    ComentarioModerado: async (comentarioModerado) => {
        const comentarios = comentariosPorSerieId[comentarioModerado.serieId] || []
        const comentario = comentarios.find(c => c.id === comentarioModerado.id)
        if (comentario) {
            comentario.status = comentarioModerado.status
            await axios.post('http://localhost:10000/eventos', {
                tipo: 'ComentarioAtualizado',
                dados: comentario
            })
        }
    }
}

app.post('/series/:id/comentarios', async (req, res) => {
    const idCom = uuidv4()
    const { texto } = req.body

    const comentario = {
        id: idCom,
        texto: texto,
        serieId: req.params.id,
        status: "pendente"
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

app.put ('/series/:id/comentarios/:idComentario', async (req, res) => {
    const { texto } = req.body
    const comentarios = comentariosPorSerieId[req.params.id] || []
    const comentario = comentarios.find(c => c.id === req.params.idComentario)
    if (!comentario) {
        return res.status(404).json({
            erro: "comentário não encontrado"
        })
    }
    comentario.texto = texto
    comentario.status = "pendente"
    
    await axios.post('http://localhost:10000/eventos', {
        tipo: 'ComentarioEditado',
        dados: comentario
    })
    res.status(200).json(comentario)

})

app.post('/eventos', (req, res) => {
    try {
        const evento = req.body
        console.log(evento)
        funcoes[evento.tipo](evento.dados)
    } catch(e) {}
    res.end()
})

const port = 4100
app.listen(port, () => console.log(`Comentários. Porta ${port}.`))