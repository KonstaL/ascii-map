const express = require('express')
const fetch = require('node-fetch');
const app = express()
const port = 3000

const art=require('ascii-art');

const { createCanvas, loadImage } = require('canvas')


   


const baseUrl = `https://b.tile.openstreetmap.org/`;
//const baseUrl = `http://c.tiles.wmflabs.org/osm-no-labels/`

app.get('/', (req, res) => res.send('Hello World!'))


app.get('/map/:z/:x/:y', (req, res) => {
    
   
    fetch(`${baseUrl}/${req.params.z}/${req.params.x}/${req.params.y}.png`)
        .then(res => res.arrayBuffer())
        .then(arrayBuffer => {

            var asciify = require('asciify-image');
        
            var options = {
                color: false,
                fit:  'box',
                width: 32,
                height: 32
            }
            
            asciify(Buffer.from(arrayBuffer), options)
            .then(function (asciified) {
                // Print asciified image to console
                //console.log(asciified);

                const canvas = createCanvas(256, 256)
                const ctx = canvas.getContext('2d')
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.font = '6.65px Courier New, Courier, monospace';
                ctx.fillStyle = "#FFFFFF";
                ctx.textBaseline = 'top';
                ctx.fillText(asciified, 0, 0); 

                var img1 = ctx.getImageData(0, 0, 256, 256);
                var data=img1.data;

                canvas.toBuffer((err, result) => {
                    const buffer = result;
                    res.contentType('image/jpeg');
                    res.end(buffer, 'binary');
                    console.log('text size', ctx.measureText(asciified))
                })
            })
            .catch(function (err) {
                // Print error to console
                console.error(err);
            });

            /*
            var image = new art.Image({
                filepath: Buffer.from(arrayBuffer),
                alphabet:'variant4'
            });

        
            image.write(function(err, rendered){
                const canvas = createCanvas(256, 256)
                const ctx = canvas.getContext('2d')
                ctx.font = '32px Arial';
                ctx.fillStyle = "#000000";
                ctx.textBaseline = 'top';
                rendered = JSON.parse( JSON.stringify( rendered ) )
                ctx.fillText(rendered, 0, 0); 

                var img1 = ctx.getImageData(0, 0, 256, 256);
                var data=img1.data;

                canvas.toBuffer((err, result) => {
                    const buffer = result;
                    res.contentType('image/jpeg');
                    res.end(buffer, 'binary');
                    console.log('text size', ctx.measureText(rendered))
                })
                
            })
       
            */
        })
        .catch(err => console.log(err))

 


/*
*/
        
    
    //fetch(`${baseUrl}/${req.params.z}/${req.params.x}/${req.params.y}.png`)
 

   
}) 
app.listen(port, () => console.log(`Ascii world listening on port ${port}!`))

//+ Jonas Raoni Soares Silva

//@ http://jsfromhell.com/geral/utf-8 [v1.0]

UTF8 = {

	encode: function(s){

		for(var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;

			s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]

		);

		return s.join("");

	},

	decode: function(s){

		for(var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;

			((a = s[i][c](0)) & 0x80) &&

			(s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?

			o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")

		);

		return s.join("");

	}

};