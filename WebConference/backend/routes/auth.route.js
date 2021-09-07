// ficheiro que contem todas as rotas de autenticação (faz parte do passport)
// ao iniciar o processo é necessário chamar o controlador de autenticação
const authController = require('../controllers/auth.controller.js');
// depois é necessário exportar todas as todas criadas
module.exports = function(app, passport) {
	// rota para o registo que permite aceder ao signup do controlador
    app.get('/signup', authController.signup); 
	// rota de login que permite aceder ao signin do controlador
    app.get('/signin', authController.signin);
	// definição das rotas de sucesso que redirecionam para o respetivo controlador
    app.get('/signupSuccess', authController.signupSuccess);
    app.get('/signinSuccess', isLoggedIn, authController.signinSuccess); // signin requere que o utilizador esteja autenticado (verificado em isLoggedIn)
	// após a submissão do formulário de login é realizado um pedido posta para a rota específica, sendo neste caso usada a estratégia de
	// autenticação local (local-signup), neste ponto a rota de sucesso anteriormente criada é chamada (signupSuccess para o signup, e 
	// signinSuccess para signin) caso o signup ou o signin sejam realizados com sucesso, caso contrário o comportamento por defeito na falha
	// é chamar o iniciar da página
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/signupSuccess',
        failureRedirect: '/signup'
    }));
    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/signinSuccess',
        failureRedirect: '/signin'
    }));
	// rota de logout que chama o controlador para o logout
	app.get('/logout', authController.logout);
	// função que verifica se o utilizador está autenticado
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }
};
