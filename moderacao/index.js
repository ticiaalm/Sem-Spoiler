const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const palavrasProibidas = ["morre", "final", "assassino", "traidor"]
const ultimosEventos = {}
const HOST = 'localhost'

const moderaComentario = async (comentario) => {
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

    await axios.post(`http://${HOST}:10000/eventos`, {
        tipo: 'ComentarioModerado',
        dados: comentarioModerado
    })
}

const funcoes = {
    ComentarioCriado: moderaComentario,
    ComentarioEditado: moderaComentario
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
app.listen(port, async () => {console.log(`Moderação. Porta ${port}.`)
    try {
        const resposta = await axios.get(`http://${HOST}:10000/eventos`)
        resposta.data.forEach(evento => {
            if (
                evento.tipo === 'ComentarioCriado' || 
                evento.tipo === 'ComentarioEditado' || 
                evento.tipo === 'ComentarioModerado' 
            ) {
                ultimosEventos[evento.dados.id] = evento
            }
        })
        for (let id in ultimosEventos) {
            let evento = ultimosEventos[id]
            try {
                funcoes[evento.tipo](evento.dados)
            } catch(e){}
        }
    } catch(e){ console.log("Barramento indisponível")}
})