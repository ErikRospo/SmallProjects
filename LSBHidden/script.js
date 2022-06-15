class Steganograph {
    constructor(canvas, image, message) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        this.image = image;
        this.message = message + "\n";
        /** @type {CanvasRenderingContext2D} */
        this.ctx = canvas.getContext('2d');
        this.ctx.drawImage(image, 0, 0);
        this.imageData = this.ctx.getImageData(0, 0, image.width, image.height);
        this.ctx.clearRect(0, 0, image.width, image.height);
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
        for (let i = 0; i < data.length; i += 4) {
            if (i < messagebitslength * 4) {
                data[i] = this.setbit(data[i], 0, this.getbit(messagebits[i / 4], 0));
            } else {
                data[i] = this.setbit(data[i], 0, 0);
            }

        }
        this.ctx.createImageData(this.imageData);
        this.ctx.putImageData(this.imageData, 0, 0);
        return this.imageData;
    }
    decode(imageData) {
        // this.ctx.clearRect(0, 0, image.width, image.height);
        this.data = this.imageData.data;
        let c = 1
        let recived = "";
        for (let i = 0; i < this.data.length; i += 1) {
            recived += this.getbit(this.data[i * 4], 0);
            if (c >= 16) {
                break
            }
            c++;
            if (this.getbit(this.data[i * 4], 0) == 1) {
                c = 0;
            }
        }
        let recivedmessage = this.frombinary(recived);
        return recivedmessage;
    }
}
/**@type {HTMLImageElement} */
image = new Image();
image.src = "./work2.png";
image.onload = function() {
    main();
};


function main() {
    canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height
    document.body.appendChild(canvas);
    let message;
    /**@type {HTMLObjectElement} */
    //let messagesource = document.getElementById('message');
    //message = messagesource.data;
    message = "This is a test of how messages can be hidden with the LSB of images. This method works with practically any image."

    let steganograph = new Steganograph(canvas, image, message);
    let encoded = steganograph.encode();
    let decoded = steganograph.decode(image);
    canvas.getContext('2d').putImageData(encoded, 0, 0);
    let outimage = document.createElement('img');
    outimage.width = image.width;
    outimage.height = image.height;
    outimage.src = canvas.toDataURL();
    outimage.onclick = function() {
        if (window.isSecureContext) {
            Clipboard.copy(outimage.src);
            alert("Image copied to clipboard");
        } else {
            console.log(outimage.src);
            alert("Image output to console")

        }
    }
    document.body.appendChild(outimage);
    canvas.width = 0;
    canvas.height = 0;
    console.log(steganograph);
    console.log(encoded);
    console.log(decoded);
}