const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const baseConsulta = {}

const funcoes = {
    SerieCriada: (serie) => {
        baseConsulta[serie.id] = {
            id: serie.id,
            titulo: serie.titulo,
            plataforma: serie.plataforma,
            comentarios: []
        }
    },
    ComentarioCriado: (comentario) => {
        const comentarios = baseConsulta[comentario.serieId]['comentarios']
        comentarios.push(comentario)
        baseConsulta[comentario.serieId]['comentarios'] = comentarios
    },
    ComentarioAtualizado: (comentarioAtualizado) => {
        const serie = baseConsulta[comentarioAtualizado.serieId]
        if (serie) {
            const aux = serie.comentarios.findIndex(c => c.id === comentarioAtualizado.id)
            if (aux >= 0) {
                serie.comentarios[aux] = comentarioAtualizado
            }
        }
    }
}

app.post('/eventos', function (req, res) {
    try {
        const evento = req.body
        console.log(evento)
        funcoes[evento.tipo](evento.dados)
    } catch(e) {}
    res.end()
})

app.get('/series', (req, res) => {
    res.json(baseConsulta)
})

app.get('/series/:id', (req, res) => {
    const id = req.params.id
    const serie = baseConsulta[id]
    if (!serie) {
        return res.status(400).json({
            erro: "série não encontrada"
        })
    }
    res.json(serie)
})

const port = 4200
app.listen(port, () => console.log(`Consulta. Porta ${port}.`))
