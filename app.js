const express = require('express')
const fetch = require('node-fetch');
const app = express()
const port = 3000

var asciify = require('asciify-image');
const { createCanvas, loadImage } = require('canvas')

const baseUrl = `https://b.tile.openstreetmap.org/`;
//const baseUrl = `http://c.tiles.wmflabs.org/osm-no-labels/`

const options = {
    color: false,
    fit:  'box',
    width: 32,
    height: 32
}

const canvas = createCanvas(256, 256)
const ctx = canvas.getContext('2d')



app.get('/map/:z/:x/:y', (req, res) => {
    fetch(`${baseUrl}/${req.params.z}/${req.params.x}/${req.params.y}.png`)
        .then(res => res.arrayBuffer())
        .then(arrayBuffer => asciify(Buffer.from(arrayBuffer), options)) 
        .then(asciified => {
            // Clear canvas
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // TODO: Figure out a way to scale text to y-axis
            ctx.save();
            ctx.scale(1, 1.04);


            //Draw chars
            ctx.font = '6.8px Courier New, Courier, monospace';
            ctx.fillStyle = "#FFFFFF";
            ctx.textBaseline = 'top';
            ctx.fillText(asciified, 0, -1, 256); 


            canvas.toBuffer((err, result) => {
                const buffer = result;
                res.contentType('image/png');
                res.end(buffer, 'binary');
                ctx.restore();
            })
        })
        .catch(err => console.log(err))
});

app.use(express.static('public'))

app.listen(port, () => console.log(`Ascii world listening on port ${port}!`))
