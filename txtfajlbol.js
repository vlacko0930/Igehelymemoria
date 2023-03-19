
/*check the envvars*/
let envvarsCorrect = true;
["INPUT_FILENAME", "OUTPUT_FILENAME"]
    .forEach((envvar) => {
        if (process.env[envvar] === undefined) {
            console.log(envvar + " missing!");
            envvarsCorrect = false;
        }
    })
if (!envvarsCorrect) {
    console.log("MISSING ENVVARS! TERMINATING!");
    process.exit(1);
}

const events = require('events');
const fs = require('fs');
const readline = require('readline');

const xlsxKeszites = require("./xlsxKeszito.js");
processLineByLine();

function processLineByLine() {

    return new Promise(async (success, failed) => {
        try {
            const igehelyek = [];  //array of people
            const rl = readline.createInterface({ //filereader
                input: fs.createReadStream(process.env["INPUT_FILENAME"]),
                crlfDelay: Infinity
            });
            rl.on('line', async (line) => {
                igehelyek.push(line)
            });
            await events.once(rl, 'close'); //wait for read all people
            const xlsx = await xlsxKeszites(igehelyek);
            await xlsx.xlsx.writeFile(process.env["OUTPUT_FILENAME"])
            return;
        } catch (err) {
            failed(err);
        }
    })
}
