import * as fs from 'fs'
const path = require('path');


export function readJSONFile() {
    const arquivoLido = fs.readFileSync(path.resolve(__dirname, 'connection.json'), 'utf-8'); /// depois ver isso
    const jsonData = JSON.parse(arquivoLido);
    return jsonData;
}

