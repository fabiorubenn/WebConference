// -> Para correr este código é necessário primeiro criar a base de dados usando o script no MySQL Workbench CE:
/*
CREATE DATABASE IF NOT EXISTS test;
USE test;
CREATE TABLE IF NOT EXISTS professor (
	codprof INT PRIMARY KEY,
    nome CHAR(45),
    coddept int,
    ativo int
);
INSERT INTO professor(codprof, nome, coddept, ativo) VALUES
	(1, 'Ana Oliveira', 1, 1),
	(2, 'Fábio Mendonça', 2, 1),
	(3, 'Mega Angus', 2, 1),
	(4, 'Carla Andrade', 3, 1),
	(5, 'Alicia Vica', 2, 1),
	(6, 'Andre Naco', 1, 1);
CREATE TABLE IF NOT EXISTS departamento (
	coddept INT PRIMARY KEY,
    descricao CHAR(45)
);
INSERT INTO departamento(coddept, descricao) VALUES
	(1, 'Informática'),
	(2, 'Artes'),
	(3, 'Gestão');
*/
// -> Também é necessário criar um script só com uma linha de código (para permitir ao nodejs ligar-se ao MYSQL) indicando: 
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';    #to use default just change 'password' to, for example, 'asd123'
// -> Depois no nodejs é necessário criar o ficheiro js em branco, neste caso, database.js, depois abrir o Node.js command prompt e ir para a pasta onde está a 
// base de dados criar (se for na d inserir: d:   e depois cd D:\Github\WebConference\WebConference\Node\tests), depois é necessário inicializar o novo programa do 
// nodejs com o comendo: npm init
// -> O init gera um questionário sendo importante indicar que o main está associado ao ficheiro database.js
// -> Depois é a instalação do express, ainda na mesma janela do Node.js command prompt inserir: npm install express --save
// -> Depois é a instalação do MYSQL para o nodejs, ainda na mesma janela do Node.js command prompt inserir: npm install mysql --save
// -> Depois é escrever o código no ficheiro database.js, que é o código escrito neste ficheiro
// -> Depois e ainda na mesma janela do Node.js command prompt correr o script usando: node database.js
// -> deve aparecer na consola a mensgem: Servidor a funcionar na porta 3000...  
// -> Depois é abrir o browser (por exemplo o google chrome) e indruzir o url: http://localhost:3000/
// -> deve aparecer na janela do browser: Nomes na base de dados: Ana Oliveira; Fábio Mendonça; Mega Angus; Carla Andrade; Alicia Vica;
// -> também deve aparecer na consola os nomes da base de dados


// usar o módulo express para criar uma applicação (con nome app), colocando (o servidor) à escuta na porta 3000
const express = require('express');
const app = express();
const server = app.listen(3000, function () {
	console.log('Servidor a funcionar na porta %s...', server.address().port);
});

app.get('/', (req, res) => {
    //res.send('Hello World!\n')


    const {createPool} = require('mysql')

    // create the connection pool to the mysql databse
    const pool = createPool(
        {
            host: "localhost",
            user: "root",
            password: "asd123",
            connectionLimit: 10
        }
    )
    
    // string para apresentar os nomes de todas as entradas na tabla professor da base de dados
    stringWithNames="<h1>Nomes na base de dados:\n"

    // use pool to query data from mysql, defining a callback 
    // function to deal with the possibility of an error occuring
    // and to display the data sent from the database
    pool.query('SELECT * FROM test.professor', (err, res2)=>{
        if (!err) {
            res2.forEach(function(v,k){
                stringWithNames += v.nome + ";\n"
                console.log(stringWithNames)
            });
            stringWithNames += "</h1>";
            res.send(stringWithNames)
            //return console.log(res)
        }
        else {
            return console.log(err)
        }
    })


  })

