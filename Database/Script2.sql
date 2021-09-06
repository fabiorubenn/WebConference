CREATE DATABASE IF NOT EXISTS test;
USE test;
CREATE TABLE IF NOT EXISTS professor (
	codprof INT PRIMARY KEY,
    nome CHAR(45),
    coddept int,
    ativo int
);
# verificar quantos elementos tem em professor
SELECT * FROM professor;
/*
INSERT INTO professor(codprof, nome, coddept, ativo) VALUES
	(1, 'Ana Oliveira', 1, 1),
	(2, 'Fábio Mendonça', 2, 1),
	(3, 'Mega Angus', 2, 1),
	(4, 'Carla Andrade', 3, 1),
	(5, 'Alicia Vica', 2, 1),
	(6, 'Andre Naco', 1, 1);
*/
CREATE TABLE IF NOT EXISTS departamento (
	coddept INT PRIMARY KEY,
    descricao CHAR(45)
);
# verificar quantos elementos tem em departamento
SELECT * FROM departamento;
/*
INSERT INTO departamento(coddept, descricao) VALUES
	(1, 'Informática'),
	(2, 'Artes'),
	(3, 'Gestão');
*/
# selecionar todas as entradas dos campos codprof e nome de professor que correspondem a procura em que coddept é igual em professor e em departamento e também quando a descrição de departamento é 'Informática'
SELECT professor.codprof, professor.nome FROM professor, departamento WHERE professor.coddept = departamento.coddept and departamento.descricao = 'Informática';
# realizar o delete lógico ao colocar o campo ativo a 0, indicado que a entrada não está ativa
UPDATE professor SET ativo = 0 WHERE (professor.codprof > 3);
SELECT * FROM professor WHERE (professor.ativo > 0);
# delete fício apaga o registo
/*
DELETE FROM professor where (professor.codprof = 6);
SELECT * FROM professor;
*/
# selecionar entradas e contar o número de ocorrências
SELECT * FROM professor WHERE codprof BETWEEN 1 AND 3;
SELECT COUNT(*) FROM professor WHERE codprof BETWEEN 1 AND 3;
# selecionar com base em caracteres, neste caso strings que começão por F
SELECT * FROM professor WHERE nome LIKE 'F%';

# to allow the connetion between nodejs and mysql run this line in a MYSQL script: ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';    to use default just change 'password' to, for example, 'asd123'