// Configurações do passport
// Chamada do módulo que permite a encriptação dos dados
var bCrypt = require('bcrypt-nodejs');
// Importar as mensagens JSON (que estão na pasta identificada por jsonMessagesPath)
const jsonMessagesPath = __dirname + "/../../assets/jsonMessages/";
var jsonMessages = require(jsonMessagesPath + "login");
// Exporta as funções
module.exports = function(passport, user) {
  // Variável com todos os dados do modelo user
  var User = user;
  // Definição da estratégia do passport (passport-local permite a autenticação usando email e password)
  var LocalStrategy = require('passport-local').Strategy;
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  // Verifica se o user existe usando o findById do sequelize que procurar users pelo id, caso exista uma
  // resposta válida os dados são carregados usando a função get (deserializeUser são operações conhecidas 
  // como "deserialize the user")
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if (user) {
        done(null, user.get());
      }
      else {
        done(user.errors, null);
      }
    });
  });
  // Definição da estratégia a usar para o registo (local-signup), associando os campos do formulário submetido
  // no pedido http aos do passport, usando o email como user name e password como password
  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // indica que o sistema pode enviar a resposta (allows us to pass back the entire request to the callback)
    },
	// Funções para aceder e validar os dados do utilizador (user)
	// Função que rece os dados do utilizador enviados pelo formulário (através da rota) e encripta a password
    function(req, email, password, done) {
      var generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };
	  // Verifica se o email que está a ser registado já existe, se sim então envia a mensagem de error (duplicate), caso contrário
	  // cria o utilizador usando o modelo user
      User.findOne({ where: { email: email } }).then(function(user) {
        if (user) {
          return done(null, false, jsonMessages.user.duplicate);
        }
        else {
          var userPassword = generateHash(password);
          var data = {
            email: email,
            password: userPassword,
            nome: req.body.firstname,
            apelido: req.body.lastname
          };
          User.create(data).then(function(newUser, created) { // cria o utilizador com os dados de data
            if (!newUser) {
              return done(null, false);
            }
            if (newUser) {
              return done(null, newUser);
            }
          });
        }
      });
    }
  ));
  // Definição da estratégia de login (local-signin), este processo é semelhante ao de registo mas em vez de verificar os dados 
  // para inserção, este são confirmados para autenticação (feita com email e password)
  passport.use('local-signin', new LocalStrategy({
      // By default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // Allows us to pass back the entire request to the callback
    },
	// Função para obter os dados do modelo user e validação dos dados inseridos no formulário
    function(req, email, password, done) {
      var User = user;
	  // Definição da função que encripta a password passada no formulário e compara (compareSync) com a passoword guradada na base de 
	  // dados (userpass, que também está encriptada)
      var isValidPassword = function(userpass, password) {
        return bCrypt.compareSync(password, userpass);
      }
	  // Procura um utilizador (findOne) que tenha o email inserido no formulário, se não houver será devolvida uma mesagem a informar
	  // que email não existe na BD, caso contrário, é usada a função isValidPassword para verificar se a password passada no
	  // formulário é igual à guardada na base de dados (se não for apresenta uma mensagem de erro, indicando que a password não existe
	  // caso contrário são retornados os dados do utilizador (var userinfo = user.get()) que correspondem aos dados do user com o
	  // email e password passados no formulário)
      User.findOne({ where: { email: email } }).then(function(user) {
        if (!user) {
          return done(null, false, jsonMessages.user.email);
        }
        if (!isValidPassword(user.password, password)) {
          return done(null, false, jsonMessages.user.password);
        }
        var userinfo = user.get();
        return done(null, userinfo);
	  // caso ocorra algum erro este é retornado
      }).catch(function(err) {
        console.log("Error:", err);
        return done(null, false,  jsonMessages.user.error);
      });
    }
  ));
}