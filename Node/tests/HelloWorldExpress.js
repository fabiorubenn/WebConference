// usar o módulo express para criar uma applicação (con nome app), colocando (o servidor) à escuta na porta 3000
const express = require('express');
const app = express();
const server = app.listen(3000, function () {
	console.log('Servidor a funcionar na porta %s...', server.address().port);
});
// criação da rota que contem o método HTTP (o método get), o caminho (neste caso é '/' indicado que é na raiz
// e uma função de callback para quando o evento ocorrer (neste caso function(req, res) que permite enviar respostas
// com dados em diferentes formatos tal como string, array, object, etc); Esta rota (que está a ser criada) representa
// a raiz da aplicação e retorna a mensagem 'Hello World!'
// para aceder a rota no chrome usar: http://localhost:3000/
app.get('/', (req, res) => {
  res.send('Hello World!')
})
// criação de uma rota para representar a localização '/help'
// para aceder a rota no chrome usar: http://localhost:3000/help
app.get('/help', (req, res) => {
  res.send('Precisa de ajuda?')
})
// criação de uma rota para representar a localização '/help/more'
// para aceder a rota no chrome usar: http://localhost:3000/help/more
app.get('/help/more', (req, res) => {
  res.send('Precisa de ainda mais ajuda?')
})