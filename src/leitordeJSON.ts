import * as fs from 'fs'
const path = require('path');


export function readJSONFile() {
    const arquivoLido = fs.readFileSync(path.resolve(__dirname, 'connection.json'), 'utf-8'); /// depois ver isso
    const jsonData = JSON.parse(arquivoLido);
    return jsonData;
}


export function readJSON(body : any) {
    var bodyString = JSON.stringify(body);
    var jsonData = JSON.parse(bodyString);
    return jsonData;
}
