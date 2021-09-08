// Controlador que contem as regras do passport, sendo indiferente a forma como é definido uma vez que este usa o sequelize
// Inclui a chamada para a pasta que contém as mensagens json (assets/jsonMessages/) sendo usadas as mensagens de login
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "login");
// Para que os módulos sejam chamados pelo auth.route.js é necessário exportá-los, cada módulo envia uma mensagem de acordo 
// com a chamada da rota
var exports = module.exports = {};
// Se um pedido de registo tiver sido efetuado com sucesso, a rota /signupSuccess chama o controlador signupSuccess que, por
// sua vez aceda ao ficheiro login e envia a mensagem que se encontra no objeto user e no método signupSuccess
exports.signupSuccess = function(req, res) {
    res.status(jsonMessages.user.signupSuccess.status).send(jsonMessages.user.signupSuccess);
};
// De forma semelhante são apresentadas as mensagens para user duplicado, user inválido e sucesso no signin
exports.signup = function(req, res) {
    res.status(jsonMessages.user.duplicate.status).send(jsonMessages.user.duplicate);
};
exports.signin = function(req, res) {
    res.status(jsonMessages.user.invalid.status).send(jsonMessages.user.invalid);
};
exports.signinSuccess = function(req, res) {
    res.status(jsonMessages.user.signinSucces.status).send(jsonMessages.user.signinSucces);
};
// A chamada logout permite terminar e destruir a sessão (req.session.destroy), assim como enviar a respetiva mensagem
exports.logout = function(req, res, err) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
            res.status(jsonMessages.user.logoutError.status).send(jsonMessages.user.logoutError);
        }
        res.status(jsonMessages.user.logoutSuccess.status).send(jsonMessages.user.logoutSuccess);
    });
};
