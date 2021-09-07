// Ficheiro que contem as rotas para a plicação excepto as rotas para autenticação
// A aplicação segue o mecanismo CRUD (create, read, update, delete) e o protocolo REST (representationsal state transfer)
// para definir os ednpoints
// Para controlar os endpoints primeiro é importado o módulo router do express (require('express').Router()) e associado 
// a uma contante (chamada router)
const router = require('express').Router();
// importação dos controladores (que se encontram na pasta controllers) possíceis de serem chamados a partir das rotas (só
// assim essas rotas conseguirão aceder aos módulos exportados em cada um dos controladores), neste caso inclui-se os 
// controladores dos campos (colunas) speaker, sponsor, conference, participant e mail
const controllerSpeaker = require('../controllers/speaker.controller.js');
const controllerSponsor = require('../controllers/sponsor.controller.js');
const controllerConference = require('../controllers/conference.controller.js');
const controllerMail = require('../controllers/mail.controller.js');
// Importação das mensagem prédefinidas em json para o login (necessário estar autenticado para algumas das rotas)
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "login");
// O próximo passo é definir cada uma das rotas, a primeira é a raiz (designada por '/')
router.get('/', function(req, res) {
    res.send("FCA Book");
    res.end();
});
// Definição de todos os endpoints e associação dos mesmos ao router previamente criado, o nome das rotas muda de acordo
// com o nome do objeto
// os speakers e os sponsors permitem o mesmo tipo de operações de leiruta (get e get/id), de inserção (post), de alteração 
// (put), de eliminação lógica (put/del) e de eliminação física (delete); todos os métodos que requerem autenticação usam
// isLoggedIn definida no fim do código
// Rotas para os speakers:
router.get('/speakers/', controllerSpeaker.read);
router.get('/speakers/:id', controllerSpeaker.readID);
router.post('/speakers/', isLoggedIn, controllerSpeaker.save);
router.put('/speakers/:id', isLoggedIn, isLoggedIn, controllerSpeaker.update);
router.put('/speakers/del/:id', isLoggedIn, controllerSpeaker.deleteL);
router.delete('/speakers/:id', isLoggedIn, controllerSpeaker.deleteF);
// Rotas para os sponsors:
router.get('/sponsors/', controllerSponsor.read);
router.get('/sponsors/:id', controllerSponsor.readID);
router.post('/sponsors/', isLoggedIn, controllerSponsor.save);
router.put('/sponsors/:id', isLoggedIn, controllerSponsor.update);
router.put('/sponsors/del/:id', isLoggedIn, controllerSponsor.deleteL);
router.delete('/sponsors/:id', isLoggedIn, controllerSponsor.deleteF);
// A rota conferences permite apenas a leitura de conferências (por segurança a inserção ou eliminação de conferências deve ser 
// feita diretamente na base de dados)
router.get('/conferences', controllerConference.readConference);
router.get('/conferences/:id', controllerConference.readConferenceID);
// Criação das rotas que permitem atuar sobre os elementos de cada conferência (cada conferência tem participants, sponsors e 
// speakers), as rotsa get permitem ler os participants, sponsors ou speakers, enquato que as rotas post permitem adicionar um 
// determinado elemento (id) a uma determinada conferência (idconf), já as rotas delete permitem remover um participant, um
// speaker ou um sponsor de uma determinada conferência
// Rotas para os participants de cada conferência:
router.get('/conferences/:idconf/participants', controllerConference.readParticipant);
router.post('/conferences/:idconf/participants/:idparticipant/', controllerConference.saveParticipant);
router.delete('/conferences/:idconf/participants/:idparticipant', controllerConference.deleteParticipant);
// Rotas para os sponsors de cada conferência:
router.get('/conferences/:idconf/sponsors/', controllerConference.readSponsor);
router.post('/conferences/:idconf/sponsors/:idsponsor', isLoggedIn, controllerConference.saveSponsor);
router.delete('/conferences/:idconf/sponsors/:idsponsor', isLoggedIn, controllerConference.deleteSponsor);
// Rotas para os speakers de cada conferência:
router.get('/conferences/:idconf/speakers/', controllerConference.readSpeaker);
router.post('/conferences/:idconf/speakers/:idspeaker', isLoggedIn, controllerConference.saveSpeaker);
router.delete('/conferences/:idconf/speakers/:idspeaker', controllerConference.deleteSpeaker);
// Rota contacts com uma sub-rota emails para envio de emails
router.post('/contacts/emails', controllerMail.send);
// Para que o router possa ser usado em toda a aplicação é necessário exportá-lo
module.exports = router;
// verificar se um pedido está autorizado, se estive o sistema avança (next) caso contrário envia uma mensagem json (para testes
// esta mensagem pode ser comentada)
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        /*  res.status(jsonMessages.login.unauthorized.status).send(jsonMessages.login.unauthorized);*/
        return next();
    }
}
