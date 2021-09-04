// carrega o módulo http do Node.js para criar uma instância do servidor (http.createServer)
// à escuta da porta 3000 (server.listen(3000)) e enviar uma resposta html com uma mensagem
const http = require('http');
const server = http.createServer(function (request, response) {
	response.writeHead(200, {'Content-type': 'text/html'});
	response.write('<html><body><h1>Hello World</h1></body></html>');
	response.end();
});
server.listen(3000);
console.log('Servidor Node.JS em execução');