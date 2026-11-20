const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const palavrasProibidas = ["morre", "final", "assassino", "traidor"]

const funcoes = {
    ComentarioCriado: async (comentario) => {
        let status = "liberado"
        for (let palavra of palavrasProibidas) {
            if (comentario.texto.includes(palavra)) {
                status = "spoiler"
            } else {
                status
            }
        }

        const comentarioModerado = {
            id: comentario.id,
            texto: comentario.texto,
            serieId: comentario.serieId,
            status: status
        
        }
        await axios.post('http://localhost:10000/eventos', {
            tipo: 'ComentarioModerado',
            dados: comentarioModerado
        })
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

const port = 4300
app.listen(port, () => console.log(`Moderação. Porta ${port}.`))