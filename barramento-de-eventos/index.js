const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const eventos = []

app.post('/eventos', async (req, res) => {
    const evento = req.body
    eventos.push(evento)
    console.log(evento)

    try {
        await axios.post('http://localhost:4000/eventos', evento)
    } catch(e) {}
    try {
        await axios.post('http://localhost:4100/eventos', evento)
    } catch(e) {}
    try {
        await axios.post('http://localhost:4200/eventos', evento)
    } catch(e) {}
    try {
        await axios.post('http://localhost:4300/eventos', evento)
    } catch(e) {}
    res.end()
})

app.get('/eventos', (req, res) => {
    res.json(eventos)
})

const port = 10000
app.listen(port, () => console.log(`Barramento de eventos. Porta ${port}.`))