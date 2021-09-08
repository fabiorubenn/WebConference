// Ficheiro que contem a estrutura (schema) da tabela (user) a ser criada pelo sequelize na base de dados definida, 
// a estrutura é composta pelo ID, que é a chave primária com autoIncrement, e por um conjunto de atributos associados
// ao utilizador, especificando o tipo (type) de dados (para o email é também validado se este é um email valido
// usando o validate: { isEmail: true } )
// Sempre que a aplicação for inicializada o sequealize chama o modelo do user e verifica se este já existe na base de
// dados, se já existir então não faz nada, caso contrário irá criar o user
module.exports = function(sequelize, Sequelize) {
	let User = sequelize.define('user', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
		nome: { type: Sequelize.STRING, notEmpty: true },
		apelido: { type: Sequelize.STRING, notEmpty: true },
		username: { type: Sequelize.TEXT },
		tipo: { type: Sequelize.TEXT },
		email: { type: Sequelize.STRING, validate: { isEmail: true } },
		password: { type: Sequelize.STRING, allowNull: false },
		sobre: { type: Sequelize.TEXT },
		last_login: { type: Sequelize.DATE },
		status: { type: Sequelize.ENUM('active', 'inactive'), defaultValue: 'active' }
	});
	return User;
}
