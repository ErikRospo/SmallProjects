#!/usr/bin/node

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
let bit=0;
class Steganograph {
    constructor(canvas, image, message) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        this.image = image;

        this.message = message;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = canvas.getContext('2d');
        this.ctx.drawImage(image, 0, 0);
        this.imageData = this.ctx.getImageData(0, 0, image.width, image.height);
        this.data = this.imageData.data;

        this.width = image.width;
        this.height = image.height;
    }
    setbit(v, bit, value) {
        return (v & ~(1 << bit)) | (value << bit);
    }
    getbit(v, bit) {
        return (v >> bit) & 1;
    }
    tobinary(str) {
        return str.split('').map(function(c) {
            return (c.charCodeAt(0).toString(2)).padStart(8, '0');
        }).join('');
    }
    frombinary(str) {
        let r = ''
        for (let index = 0; index < str.length; index += 8) {
            r += String.fromCharCode(parseInt(str.substr(index, 8), 2));
        }
        return r;
    }
    encode() {
        let message = this.message;
        let data = this.data;
        let binmessage = this.tobinary(message);
        let messagebits = binmessage.split('');
        let messagebitslength = messagebits.length;
        if (messagebitslength > (data.length/4)) {
            console.log("Message is too long");
            console.log("Message length: " + messagebitslength);
            console.log("Image length: " + (data.length/4));
            console.log("Message overflow: " + (messagebitslength - (data.length/4)));

        }
        for (let i = 0; i <= data.length; i += 4) {
            if (i <= (messagebitslength * 4)) {
                data[i] = this.setbit(data[i], bit, this.getbit(messagebits[i / 4], 0));
            } else if (i<=(messagebitslength*4)+32) {
                data[i] = this.setbit(data[i], bit, 0);
            } else {
                data[i]=data[i]
            }

        }
        this.ctx.createImageData(this.imageData);
        this.ctx.putImageData(this.imageData, 0, 0);
	let now=new Date().getTime();
	fs.writeFileSync('Output/Encoding/Out'+now+'.png',this.canvas.toBuffer("image/png"));
        return this.imageData;
    
}
    decode() {
        // this.ctx.clearRect(0, 0, image.width, image.height);
        let data = this.data;
        let c = 1
        let recived = "";
        //let now=new Date().getTime();
       // fs.writeFileSync('Output/Encoding/Out'+now+'.png', this.canvas.toBuffer("image/png"));

        for (let i = 0; i <= data.length; i += 1) {
            recived += this.getbit(data[i * 4], bit);
            if (c >= 16) {
                break
            }
            c++;
            if (this.getbit(data[i * 4], bit) == 1) {
                c = 0;
            }
        }
        // console.log(recived);
        recived = recived.replace(/00000000/gi, "")
        let recivedmessage = this.frombinary(recived);
        return recivedmessage;
    }
    tohex(str) {
        return str.split('').map(function(c) {
            return (c.charCodeAt(0).toString(16)).padStart(2, '0');
        }).join('');
    }
    fromhex(str) {
        let r = ''
        for (let index = 0; index < str.length; index += 2) {
            r += String.fromCharCode(parseInt(str.substr(index, 2), 16));
        }
        return r;
    }
}

let gpath, gmessage;
readline.question("Encoding or Decoding? (e/d)", (answer) => {
    if (answer == "e") {
        readline.question('Enter the path to the image: ', (path) => {
            gpath = path;
            readline.question("Enter the message: ", (message) => {
                gmessage = message
                fs.access(message, fs.constants.R_OK, (err) => {
                    if (err) {
                        console.log("Input interpreted as message")
                        gmessage = gmessage
                        loadImage(gpath).then(image => { encode(image, gmessage) });
                    } else {
                        console.log("Input interpreted as path");
                        // gmessage=fs.readFileSync(gmessage).toString()
                        fs.readFile(gmessage, 'utf-8', (err, data) => {
                            if (err) {
                                console.log("Error reading file")
                            } else {
                                gmessage = data.toString()
                                // console.log(gmessage)
                                loadImage(gpath).then(image => { encode(image, gmessage) });
                            }
                        })
                    }
                })
                readline.close();
            });
        })
    } else if (answer == "d") {
        readline.question('Enter the path to the image: ', (path) => {
            gpath = path;
            loadImage(gpath).then(image => {
                decode(image)
                readline.close();
            });
        })
    } else {
        console.log("Invalid input")
        readline.close()
    }
})

function encode(image, message) {
    const width = image.width;
    const height = image.height;

    message = message || "This is a test of how messages can be hidden with the LeastSignificantBit of images. This method works with practically any image."
    let canvas = createCanvas(width, height);
    let steganograph = new Steganograph(canvas, image, message);
    let encoded = steganograph.encode();
    let decoded = steganograph.decode();
    message = steganograph.message
    console.assert(message == decoded, "Message was not encoded and decoded correctly");
    // console.log("Message In        : " + message);
    // console.log("Message Out       : " + decoded);
    // console.log("Message length In : " + message.length);
    // console.log("Message length Out: " + decoded.length);
    // console.log("Message Hex In    : " + steganograph.tohex(message));
    // console.log("Message Hex Out   : " + steganograph.tohex(decoded));
    // console.log()
    // let now = new Date().getTime();
    // canvas.getContext('2d').putImageData(encoded, 0, 0);
    // const buffer = canvas.toBuffer('image/jpeg');
    // fs.writeFileSync('Output/Encoding/' + now + '.jpg', buffer);
}

function decode(image) {
    const width = image.width;
    const height = image.height;
    let canvas = createCanvas(width, height);

    let steganograph = new Steganograph(canvas, image, "Encoded");
    // let decoded = steganograph.decode(image);
    steganograph.ctx.drawImage(image, 0, 0);

    let decoded = steganograph.decode();
    let now = new Date().getTime();
    console.log("Message In        : " + decoded);
    console.log("Message Hex In    : " + steganograph.tohex(decoded));


    fs.writeFileSync("Output/Decoding/" + now + ".txt", decoded);
}
