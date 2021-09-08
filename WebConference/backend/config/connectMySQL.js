// ficheiro que contem os dados de ligação à base de dados mysql, o ficheiro de ligação cria o conector con,
// sendo de seguida exportado (estes dados são os mesmo do ficheiro connect.json mas têm um formato diferente)
const mysql = require('mysql');
module.exports = {
	con: mysql.createConnection({
		host     : 'webitcloud.net',
		user     : 'webitclo_webbook',
		password : 'webbookPW#2018',
		database : 'webitclo_webbook'
	})
};