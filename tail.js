const fs = require("fs");
const events = require("events")

class Tail extends events.EventEmitter {
    constructor(filename, nLast) {
        super();
        this.filename = filename;
        this.currPos = this.fetchStartPos(nLast);
        // this.readFile(this.currPos,fs.statSync(this.filename).size)
        this.watch();
    }

    fetchStartPos(nLast) {
        if (nLast) {
            let fileData = fs.readFileSync(this.filename, { encoding: 'utf-8' });
            // let fileDataString = fileData.toString()
            let breakLineRegEx = /[\r]{0,1}\n/

            //broken the data in lines
            let lines = fileData.split(breakLineRegEx);
            let startLines = lines.length - nLast;
            let byteBuffer = 0;
            let temp = "";

            for (let i = 0; i < startLines; i++) {
                temp = temp + lines[i] + "\n"
            }
            byteBuffer = Buffer.byteLength(temp)
            return byteBuffer;
        }

        return fs.statSync(this.filename).size;
    }

    watch() {
        fs.watch(this.filename, (eventName, fileName) => {
            if (eventName === "change") {
                this.change()
            }
        })
    }

    change() {
        let p = fs.statSync(this.filename).size;
        if (p > this.currPos) {
            this.readFile(this.currPos, p);
            this.currPos = p
        }
    }

    readFile(start, end) {
        let stream = fs.createReadStream(this.filename, { start, end: end - 1 });

        stream.on("error", () => {
            console.log("error")
        })

        stream.on("data", (data) => {
            data = data.toString()
            console.log("data", data)
            this.emit("data", data)
        })
    }
}

module.exports = {
    Tail
}
