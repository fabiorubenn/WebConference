// carrega o módulo http do Node.js para criar uma instância do servidor (http.createServer)
// à escuta da porta 3000 (server.listen(3000)) e enviar uma resposta html com uma mensagem
const http = require('http');
var fs = require('fs');

const server = http.createServer(function (request, response) {
	console.log('request was made to: ' + request.url);
	response.writeHead(200, {'Content-type': 'text/html'});
	var myReadStream = fs.createReadStream('D:\Github\WebConference\WebConference\WebConference\index.html', 'utf8');
	myReadStream.pipe(response);
});
server.listen(3000, '127.0.0.1');
console.log('Servidor Node.JS em execução');