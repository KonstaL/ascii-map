const express = require('express')
const asciify = require('asciify-image');
const { createCanvas, loadImage} = require('canvas')
const setupExceptionHandlers = require('./exceptionCatchers');

const fetch = require('node-fetch');
const app = express();
const port = 4444;
const charsPerTile = 32;
const tileSize = 256;

const baseUrl = `https://b.tile.openstreetmap.org/`;
//const baseUrl = `http://c.tiles.wmflabs.org/osm-no-labels/`

const asciifyOptions = {
    color: false,
    fit:  'box',
    width: charsPerTile,
    height: charsPerTile
}

const isDarkMode = true;
setupExceptionHandlers();

const canvas = createCanvas(tileSize, tileSize);
let ctx;
// for some reason the server crashes if this is done instantly
setTimeout(() => ctx = canvas.getContext('2d'), 500);



app.get('/map/:z/:x/:y', (req, res) => {

    fetch(`${baseUrl}/${req.params.z}/${req.params.x}/${req.params.y}.png`)
        .then(res => res.arrayBuffer())
        .then(arrayBuffer => asciify(Buffer.from(arrayBuffer), asciifyOptions)) 
        .then(asciified => {
            // Clear canvas
            ctx.fillStyle = isDarkMode ? "#000000" : "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const textRows = asciified.split('\n');

            //setup monospaced font
            ctx.font = '6.8px Courier New, Courier, monospace';
            ctx.fillStyle = isDarkMode ? "#FFFFFF" : "#000000";
            ctx.textBaseline = 'top';

            // Draw the rows
            for (let i = 0; i < textRows.length; i++) {
                ctx.fillText(textRows[i], 0, (tileSize/asciifyOptions.width)*i, tileSize+1); 
            }

            // Respong with an png image
            canvas.toBuffer((err, result) => {
                const buffer = result;
                res.contentType('image/png');
                res.end(buffer, 'binary');
            })
        })
        .catch(err => console.log(err))
});

app.use(express.static('public'))

app.listen(port, () => console.log(`Ascii world listening on port ${port}!`))

