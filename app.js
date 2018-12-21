const express = require('express')
const fetch = require('node-fetch');
const app = express()
const port = 3000

const baseUrl = `https://b.tile.openstreetmap.org/`;

app.get('/', (req, res) => res.send('Hello World!'))


app.get('/map/:x/:y/:z', (req, res) => {
    
    
    fetch(`${baseUrl}/${req.params.z}/${req.params.x}/${req.params.y}.png`)
        .then(response => response.buffer())
        .then(img => {     
            res.setHeader("Content-Type", "image/png")
            res.end(img, 'binary'); 
        })
        .catch(err => {
            console.error('error!', err);
            res.json(err);
        });

   
}) 
app.listen(port, () => console.log(`Ascii world listening on port ${port}!`))