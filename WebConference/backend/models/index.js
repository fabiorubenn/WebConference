// Ficheiro que configura o acesso do passport aos modelos e obriga a utilização de variáveis declaradas (use strict),
// e necessita dos módulos do sistema (fs), do diretório de ficheiros (path) e do sequelize
"use strict";
let fs        = require("fs");
let path      = require("path");
let Sequelize = require("sequelize");
// Após a criação dos módulos é necessário aceder ao ficheiro de configuração e configurar a conta do sequelize, os dados
// de configuração estão indicados por MySQL e presentes no ficheiro config.json que se encontra na pasta config
let env       = "MySQL";
let config    = require(path.join(__dirname, '../', 'config', 'config.json'))[env];
let sequelize = new Sequelize(config.database, config.username, config.password, config);
// Iniciação da base de dados (db), usando uma função que permite ler os dados de configuração presentes no próprio
// ficheiro bem comopercorrer todos os modelos da pasta models já criados no ficheiro server.js (quando chama loader.js)
// Após percorrer todos os modelos, o modelo é associado a um objeto sequelize do node.js, como neste exemplo existe apenas
// um modelo, as operações permitem inicializar a BD com os dados presentes no ficheiro user.model.js
let db        = {};
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });
// Exportação da base de dados
Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
module.exports = db;
