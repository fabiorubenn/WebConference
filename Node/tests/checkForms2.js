// express: A lightweight web application framework for Node.js. We will be using this to handle routing in our backend server.
// body-parser: A middleware which will help us parse incoming request inputs (user inputs) to the req.body object.
// express-validator: The library which we will be using to handle incoming input validation.
const express = require('express');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator())
const port = process.env.PORT || 8080;


// listen to requests in the specified port
app.listen(port);
console.log('Server running at: http://localhost:'+port);

// provides the html page when the user accesses the server (rota do root)
app.get('/', (req, res) => {
    res.sendFile('formToServer.html', { root: __dirname });
});

// basta abrir o brwoser e usar como url: http://localhost:8080/api/users?id=4&token=sdfa3&geo=us
app.get('/api/users', (req, res) => {
	const user_id = req.param('id');
	const token = req.param('token');
	const geo = req.param('geo');
	res.send(user_id + ' ' + token + ' ' + geo);
});

// usar a mesma rota do pedido get para o id, token e geo mas agora para o pedido post
app.post('/api/users', (req, res) => {
	const user_id2 = req.body.id;
	const token2 = req.body.token;
	const geo2 = req.body.geo;
	res.send(user_id2 + ' ' + token2 + ' ' + geo2);
});

app.post('/login', (req, res) => {
	req.checkBody("email", "Insira um email valido") .isEmail();
	req.checkBody("password", "Nao tem pelo menos 6 caracteres") .isLength({min: 6});
    const errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    res.status(200).json({
        success: true,
        message: 'Login successful',
    })
});