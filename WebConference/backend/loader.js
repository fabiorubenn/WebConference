// este ficheiro permite definir um conjunto de estratégias que se´~ao usadas pelo servidor, nele são indicados os módulos que a aplicação irá usar,
// importar os ficheiros desenvolvidos e forçar (através de app.use) a utilização de determinados módulos
// a constate app inclui a aplicação app (exportada no final do ficheiro server.js)
const app = require('./server');
// criação de um router comporto pelas rotas definidas no ficheiro main.route.js
const router = require('./routes/main.route');
// importação dos módulos necessários à execução do projeto:
// -cookie-parser: middleware usado para analisar os cookies anexados à solicitação feita pelo cliente ao servidor
// -passport: middleware de autenticação do node.js
// -express-session: framework (do lado do servidor HTTP) usada para criar e gerenciar um middleware de sessão
// -express-sanitizer: middleware para Caja-HTML-Sanitizer, que envolve o Google Caja sanitizer
// -body-parser: middleware do node.js para análise do corpo de pedidos http
// -express-validator: middleware do express que envolve o validador.js, uma biblioteca que fornece funções de validador e higienizador
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator'); 
// criar a ligação para a pasta models que contém os medelos da base de dados a serem usados pelo passport
const models = require("./models/");
// definição das variáveis a serem usadas pela aplicação
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(cookieParser());
app.set('trust proxy', 1);
// após a definição das vrariáveis é necessário criar uma sessão para que estas possão ser usadas, neste caso a sessão tem como password para os
// cookies de sessão a palavra webbookfca, resave a falso (não salva novamente a sessão), força a sessção “uninitialized” (nova sessão que não foi
// modificada) a ser gravada, e cookie seguro que usa apenas http e duração de uma hora (maxAge=60000) logo a sessão tem uma duração máxima de uma
// hora, após a qual expira
app.use(session({
  secret: 'webbookfca',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 60000,
    httpOnly: true,
  }
}));
app.use(expressValidator());
// para que seja possível usar a sessão, esta deve ser associada a uma variável global (neste caso global.sessData), para verificar se existe alguma
// sessão já criada (e se a mesma foi criada com sucesso) deve ser usada uma função para efetuar a verificação, caso a sess~~ao não tenha ainda sido
// associada a uma variável do servidor então armazena numa variável global (global.sessData), caso contrário, o sistema enviará essa informação e
// utilizará a variável previamente criada
app.use(function(req, res, next) {
  // verifica se a sessão existe
  if (global.sessData === undefined) {
    global.sessData = req.session;
    global.sessData.ID = req.sessionID;
  }
  else { // se o cookie de sessão já estava presente então usa-o
    console.log('session exists', global.sessData.ID);
  }
  next();
});
// usar o passport para permitir logins, logo é necessário inicia-lo, associá-lo à sessão criada, evocar o ficheiro que contém as rotas de autenticação
// e incluir o ficheiro de configuração passport.js', por fim é necessário evocar o modelo de autenticação (model.user) e associá-lo ao passport (usando
// (passport, models.user))
app.use(passport.initialize());
app.use(passport.session()); // sessões de login persistentes
require('./routes/auth.route.js')(app, passport);
require('./config/passport/passport.js')(passport, models.user);
// como o passport usa o sequelize é necessário sincronizar os modelos do servidor (que se encontram na pasta models) com a base de dados
models.sequelize.sync().then(function() {
  console.log('Database updated!');
}).catch(function(err) {
  console.log(err, "Something went wrong with the Database Update!");
});
// por fim é necessário forçar a aplicação a usar o router e exportar o aplicação (app)
app.use('/', router);
module.exports = app;