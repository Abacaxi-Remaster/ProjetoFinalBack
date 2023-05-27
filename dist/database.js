"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criaAdms = exports.criaProfessores = exports.criaEmpresas = exports.criaAluno = exports.criarConexao = void 0;
const mysql_1 = __importDefault(require("mysql"));
const leitordeJSON_1 = require("./leitordeJSON");
function criarConexao() {
    const jsonObject = (0, leitordeJSON_1.readJSONFile)();
    var connection = mysql_1.default.createConnection({
        host: jsonObject.host,
        database: jsonObject.database,
        user: jsonObject.user,
        password: jsonObject.password
    });
    return connection;
}
exports.criarConexao = criarConexao;
var connection = criarConexao();
function criaAluno(objeto) {
    var comando = "INSERT INTO alunos (nome,senha,email,nicho) values (\"" +
        objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.nicho + "\");";
    return comando;
}
exports.criaAluno = criaAluno;
function criaEmpresas(objeto) {
    var comando = "INSERT INTO empresas (nome,senha,email,CNPJ) values (\"" +
        objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CNPJ + "\");";
    return comando;
}
exports.criaEmpresas = criaEmpresas;
function criaProfessores(objeto) {
    var comando = "INSERT INTO professores (nome,senha,email,CPF) values (\"" +
        objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CPF + "\");";
    return comando;
}
exports.criaProfessores = criaProfessores;
function criaAdms(objeto) {
    var comando = "INSERT INTO adms (nome,senha,email) values (\"" +
        objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\");";
    return comando;
}
exports.criaAdms = criaAdms;
