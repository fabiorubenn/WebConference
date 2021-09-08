// Controlador que permite efetuar operações na base de dados na tabela conferences
// Inclui a chamada para a pasta que contém as mensagens json (assets/jsonMessages/) sendo usadas as mensagens referentes à base de dados (bd)
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
// Inclui a ligação à base de dados que se encontra na pasta config
const connect = require('../config/connectMySQL');

// Criação das funções que permitem alterar os dados da bd de acordo com o pedido da rota

// Função de leitura (permite ler todos os dados da conferência) que retorna o resultado no callback
function readConference(req, res) {
	// A função usa o con para efetuar uma query à bd , esta query permite devolver o id da conferência (idConference), o acrónimo, o nome, a
	// descrição, o local e a data da conferência
    const query = connect.con.query('SELECT idConference, acronimo, nome, descricao, local, data FROM conference order by data desc', function(err, rows, fields) {
        console.log(query.sql); // Fazer o log na consola para ajudar no debuging da query (permite copiar a query e testar diretamente na bd)
		// verifica os resultados recebidos, caso a query executada retorne um erro então apresenta a mensagem dbError
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else { // caso a query executada não retorne erro mas também não retorne qualquer registo (rows.length == 0) então envia a mensagem noRecords
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else { // caso a query executada não retorne erro e tenha retornado registos então estes são enviados para o cliente (browser)
                res.send(rows);
            }
        }
    });
}

// Função semelhante à readConference mas esta função devolve apenas od dados de uma conferência específica 
function readConferenceID(req, res) {
	// Como os dados são passados diretamente no pedido, tem de ser usado o req.params.id, de forma a proteger a inserção de dados é necessário
	// usar o sanitize e o escape dos dados recebidos 
    const idConf = req.sanitize('idconf').escape();
    const post = { idConference: idConf };
	// Adicionar a questão de pesquisa no where e por segurança os dados são parametrizados através do ? que é mapeado pelo objeto post (este 
	// contem o idConference passado no pedido)
    const query = connect.con.query('SELECT idConference, acronimo, nome, descricao, local, data FROM conference where ? order by data desc', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

// Função para ler todos os participantes inscritos numa determinada conferência (identificada por idConf), o processo é semelhante ao 
// da função readConferenceID, mudando apenas a query 
function readParticipant(req, res) {
    const idconference = req.sanitize('idconf').escape();
    const post = { idConference: idconference };
    const query = connect.con.query('SELECT distinct idParticipant, nomeParticipante FROM conf_participant where ? order by idParticipant desc', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

// Função para registar um participante (com id dado por idparticipant e nome dado por nomeparticipant) na conferência indicada por idconf,
// atravéz da tabela conf_participant (presente na base de dados), por segurança os dados são higienizados (sanitize e escape) e o participante
// é identificado pelo seu email 
function saveParticipant(req, res) {
    // Receber os dados do formulário que são enviados por post
    req.sanitize('idparticipant').escape();
    req.sanitize('idconf').escape();
    req.sanitize('nomeparticipant').escape();
	// Verifica se o idparticipant é di tipo email (o email é usado para identificar o participante)
    req.checkParams("idparticipant", "Insira um email válido.").isEmail(); 
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        const idParticipant = req.params.idparticipant;
        const idConf = req.params.idconf;
        const nome = req.body.nomeparticipant;
		// Faz as verificações de segurança e se todas passarem insere o novo participante
        if (idParticipant != "NULL" && idConf != "NULL" && typeof(idParticipant) != 'undefined' && typeof(idConf) != 'undefined') {
			// Formata a mensagem post para inserir os dados na base de dados (BD)
            const post = { idParticipant: idParticipant, idConference: idConf, nomeParticipante: nome };
            // Criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO conf_participant SET ?', post, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
                }
                else {
                    console.log(err);
                    if (err.code == "ER_DUP_ENTRY") {
                        res.status(jsonMessages.db.duplicateEmail.status).send(jsonMessages.db.duplicateEmail);
                    }
                    else
                        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
}

// Função para apagar um participante (com id dado por idparticipant e nome dado por nomeparticipant) da conferência indicada por idconf,
// atravéz da tabela conf_participant (presente na base de dados)
function deleteConfParticipant(req, res) {
    // Código para criar e executar a query de leitura na BD
    req.sanitize('idparticipant').escape();
    req.sanitize('idconf').escape();
    req.sanitize('nomeparticipant').escape();
    req.checkParams("idparticipant", "Insira um email válido.").isEmail();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        const idconference = req.params.idconf;
        const idparticipant = req.params.idparticipant;
        const params = [idconference, idparticipant];
        const query = connect.con.query('DELETE FROM conf_participant where idConference = ? and idParticipant = ?', params, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
            }
            else {
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            }
        });
    }
}

// Função de leitura da tabela sponsor (permite ler todos os dados dos sponsors) que retorna o resultado no callback
function readConfSponsor(req, res) {
    const idconference = req.sanitize('idconf').escape();
    const post = { idConference: idconference };
    const query = connect.con.query('SELECT distinct sponsor.idSponsor, nome, logo,categoria, link, active FROM sponsor, conf_sponsor where ? order by idSponsor desc', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            console.log(err);
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

// Função para inserir sponsor (identificado por idsponsor) na conferência idconf, atravéz da tabela conf_sponsor
function saveConfSponsor(req, res) {
    // Receber os dados do formuário que são enviados por post
    const idSponsor = req.sanitize('idsponsor').escape();
    const idConf = req.sanitize('idconf');
    if (idSponsor != "NULL" && idConf != "NULL" && typeof(idSponsor) != 'undefined' && typeof(idConf) != 'undefined') {
        const post = { idSponsor: idSponsor, idConference: idConf };
        // Criar e executar a query de gravação na BD para inserir os dados presentes no post
        const query = connect.con.query('INSERT INTO conf_sponsor SET ?', post, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
            }
            else {
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            }
        });
    }
    else
        res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
}

// Função para apagar sponsor (identificado por idsponsor) da conferência idconf, atravéz da tabela conf_sponsor
function deleteConfSponsor(req, res) {
    // Criar e executar a query de leitura na BD
    const idSponsor = req.sanitize('idsponsor').escape();
    const idConf = req.sanitize('idconf').escape();
    const params = [idConf, idSponsor];
    const query = connect.con.query('DELETE FROM conf_sponsor where idConference = ? and idSponsor = ?', params, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

// Função de leitura da tabela speaker (permite ler todos os dados dos speaker) que retorna o resultado no callback
function readConfSpeaker(req, res) {
    // Criar e executar a query de leitura na BD
    const idConf = req.sanitize('idconf').escape();
    const post = { idConference: idConf };
    const query = connect.con.query('SELECT distinct a.idSpeaker, nome, foto, bio,link, filiacao, linkedin,twitter,facebook, cargo, active FROM speaker a, conf_speaker b where a.idSpeaker = b.idSpeaker  and ? order by idSpeaker desc', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

// Função para inserir speaker (identificado por idspeaker) na conferência idconf, atravéz da tabela conf_speaker
function saveConfSpeaker(req, res) {
    // Receber os dados do formuário que são enviados por post
    const idConf = req.sanitize('idconf').escape();
    const idSpeaker = req.sanitize('idspeaker').escape();
    if (idSpeaker != "NULL" && idConf != "NULL" && typeof(idSpeaker) != 'undefined' && typeof(idConf) != 'undefined') {
        const post = { idSpeaker: idSpeaker, idConference: idConf };
        // Criar e executar a query de gravação na BD para inserir os dados presentes no post
        const query = connect.con.query('INSERT INTO conf_speaker SET ?', post, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
            }
            else {
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            }
        });
    }
    else
        res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
}

// Função para apagar speaker (identificado por idspeaker) da conferência idconf, atravéz da tabela conf_speaker
function deleteConfSpeaker(req, res) {
    //criar e executar a query de leitura na BD
    const idConf = req.sanitize('idconf').escape();
    const idSpeaker = req.sanitize('idspeaker').escape();
    const params = [idConf, idSpeaker];
    console.log(params);
    const query = connect.con.query('DELETE FROM conf_speaker where idConference = ? and idSpeaker = ?', params, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

// Exportar as funções para que fiquem acessíveis através das rotas (neste caso, o nome do módulo a exportar é o mesmo
// da função (módulo:função)
module.exports = {
    readConference: readConference,
    readConferenceID: readConferenceID,
    readParticipant: readParticipant,
    saveParticipant: saveParticipant,
    readSponsor: readConfSponsor,
    saveSponsor: saveConfSponsor,
    readSpeaker: readConfSpeaker,
    saveSpeaker: saveConfSpeaker,
    deleteSpeaker: deleteConfSpeaker,
    deleteSponsor: deleteConfSponsor,
    deleteParticipant: deleteConfParticipant
};