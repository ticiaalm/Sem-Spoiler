const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const series = {}
let id = 1
const HOST = 'localhost'

app.get('/series', (req, res) => {
    res.json(series)
})

app.post('/series', async (req, res) => {
    const { titulo, plataforma } = req.body

    if (!titulo || !plataforma) {
        return res.status(400).json({
             erro: "titulo e plataforma são obrigatórios" 
        })
    }

    const serie = {
        id: id,
        titulo: titulo,
        plataforma: plataforma
    }
    series[id] = serie

    await axios.post(`http://${HOST}:10000/eventos`, {
        tipo: 'SerieCriada',
        dados: serie
    })
    
    id++
    res.status(201).json(serie)
})

app.post('/eventos', (req, res) => {
    try {
        const evento = req.body
        console.log(evento)
    } catch(e) {}
    res.end()
})

const port = 4000
app.listen(port, () => console.log(`Séries. Porta ${port}.`))