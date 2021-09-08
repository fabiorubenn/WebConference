// Controlador para envio de emails usando os módulos nodemailer e nodemailer-smtp-transport, cuja combinação permite enviar emails
// através de servidores Simple Mail Transfer Protocol (SMTP) seguros
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
// Importar as mensagens JSON (que estão na pasta identificada por jsonMessagesPath)
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "mail");
// Função para envio de emails cujos parametros (res) são higienizados (sanitize e escape) e validados (checkBody), assegurando 
// que todos os campos necessários foram fornecidos (typeof(email) != "undefined" && typeof(subject) != "undefined" && typeof(name) != "undefined")
function sendMail(req, res) {
 const name = req.sanitize('name').escape();
 const email = req.sanitize('email').escape();
 const subject = req.sanitize('subject').escape();
 req.checkBody("name", "Insira apenas texto", 'pt-PT').matches(/^[a-z ]+$/i);
 req.checkBody("email", "Insira um email válido.").isEmail();
 const errors = req.validationErrors();
 if (errors) {
  res.send(errors);
  return;
 }
 else {
  if (typeof(email) != "undefined" && typeof(subject) != "undefined" && typeof(name) != "undefined") {
   // Os campos são inseridos no conteúdo da mensagem (bodycontent) configurada por:
   let bodycontent = "";
   bodycontent += 'Caro ' + req.body.name + ',<br>' + '<br>';
   bodycontent += 'Agradecemos o seu contacto!' + '<br>' + 'Obrigado!' + '<br>' + '<br>';
   bodycontent += 'Mensagem enviada: <blockquote><i>';
   bodycontent += req.body.subject + '<br>' + '<br>' + 'mensagem enviada por ' + req.body.name;
   bodycontent += ' com o email <a href="mailto:' + req.body.email + '" target="_top">' + req.body.email + '</a>';
   bodycontent += '</i></blockquote>';
   // O envio de emails permite enviar também imagens que devem estar na pasta assets e serem introduzidas através da rota estática, neste caso é 
   // usada a imagem mail.png guradada num servidor externo e acedida atrazed do Heroku
   bodycontent += '<img src="https://fcawebbook.herokuapp.com/assets/images/mail.png" alt="mail.icon" height="42" width="42">'; 
   // Após o preenchimento do body é necessário definir o transporter com os dados do servidor de email, neste caso o servidor de email é do Google
   // (o Gmail) e uma conta criada para a conferência (mailserverpw@gmail.com)
   const transporter = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth: {
     user: 'mailserverpw',
     pass: "ttxirdxzkafhcuel"
    }
   }));
   // Para verificar que o servidor está ativo e que não existem error usa-se a função verify
   transporter.verify(function(error, success) {
    if (error) {
     console.log(error);
     res.status(jsonMessages.mail.serverError.status).send(jsonMessages.mail.serverError);
    }
    else {
     console.log('Server is ready to take our messages');
    }
   });
   // Para enviar o email é necessário definir as suas opções: emisor (from); recetor (to); Carbon Copy (CC); assunto (subject); conteúdo (html)
   const mailOptions = {
    from: req.body.email,
    to: 'mailserverpwt@gmail.com',
    cc: req.body.email,
    subject: 'FAC Book - site contact',
    html: bodycontent
   };
   // Usar a função para envio do email (sendMail) e passar as configurações como parametros
   transporter.sendMail(mailOptions, function(error, info) {
    // Se não existirem erros o email será enviado
    if (error) {
     console.log(error);
     res.status(jsonMessages.mail.mailError.status).send(jsonMessages.mail.mailError);
    }
    else {
     console.log('Email sent: ' + info.response);
     res.status(jsonMessages.mail.mailSent.status).send(jsonMessages.mail.mailSent);
    }
   });
  }
  // Caso algum dos campos obrigatórios não tenha sido submetido pelo cliente então este receberá uma mensagem a indicar que campos obrigatórios 
  // estão em falta
  else
   res.status(jsonMessages.mail.requiredData.status).send(jsonMessages.mail.requiredData);
 }

}
// Exportar as funções
module.exports = {
 send: sendMail
};
