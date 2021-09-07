// definição das portas e caminho do servidor, caso não esteja definidas (uso do or: ||) então usa a porta 8080 no caminho 127.0.0.1
const port = process.env.PORT || 8080;
const host = process.env.HOST || '127.0.0.1';
// adicionar o módulo express e associá-lo a variavel express
const express = require('express');
// criação de uma aplicação do tipo express
const app = express();
const cors = require("cors");
// usar a aplicação cors para controlar os acessos (definindo permissões) a todos os domínios, neste caso apenas se permite que sejam autorizados os pedidos realizados
// pelo domínios registados no array permittedLinker, todavia para testar a aplicação é mais fácil não restringir os acessos logo o código está comentado
app.use(cors({
  exposedHeaders: ['Location'],
}));
/*
// restição dos acessos:
const permittedLinker = ['localhost', '127.0.0.1', 'http://eventos.esmad.ipp.pt/webconference', 'http://eventos.esmad.ipp.pt/', process.env.IP]; // who can link here?
app.use(function(req, res, next) {
  let i = 0,
    notFound = 1,
    referer = req.get('Referer');
  if ((req.path === '/') || (req.path === '')) {
    res.send('{"message" : "Unauthorized access", "desc": "Your domain is not registered"}');
  } 
  if (referer) {
    while ((i < permittedLinker.length) && notFound) {
      notFound = (referer.indexOf(permittedLinker[i]) === -1);
      i++;
    }
  }
  if (notFound) {
    console.log("notfound");
    res.send('{"message" : "Unauthorized access", "desc": "Your domain is not registered"}');
  }
  else {
    next(); // access is permitted, go to the next step in the ordinary routing
  }
});
*/
// o servidor necessita de aceder a ficheiros estáticos logo define-se rotas para aceder às pastas que contêm os ficheiros: a pasta assets tem informações e ficheiros públicos
// como a imagem enviada por email e as mensagens JSON definidas paras esta aplicação; a pasta views irá alojar os ficheiros do frontend (html, css e js)
// se as rotas não forem criadas então o servidor não vai conseguir encontrar o caminho correto para os ficheiros apesar de este existir no sistema operativo
app.use('/assets', express.static('assets'));
app.use('/views', express.static('views'));
// colocar a aplicação à escuta na porta definida (caso existam erros estes serão apresentados na consola)
app.listen(port, function(err) {
  if (!err) {
    console.log('Your app is listening on ' + host + ' and port ' + port);
  }
  else {
    console.log(err);
  }
});
// para que a aplicação seja usada nos outros ficheiros é necessário exportar o módulo
module.exports = app;
// importar o ficheiro loader.js que contem todos os módulos essenciais ao servidor
require('./loader.js');