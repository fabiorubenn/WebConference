// Controlador para as ações relacionadas com os sponsors
// Importar as mensagens JSON (que estão na pasta identificada por jsonMessagesPath)
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
// Função de leitura (que faz a importação da base de dados) que retorna o resultado no callback
const connect = require('../config/connectMySQL'); 

// Função que permite ler dados da tavela sponsor
function read(req, res) {
    // Criar e executar a query de leitura na BD (idSponsor, nome, logo, categoria, link e active(permite fazer o delete lógico), 
	// ordenados por ordem decrescente (desc) do idSponsor)
    const query = connect.con.query('SELECT idSponsor, nome, logo, categoria, link, active FROM sponsor order by idSponsor desc', function(err, rows, fields) {
		// Caso seja detetado um erro (err) na query este será impresso no no console log e uma mensagem JSON com o estado (status)
		// e descrição (dbError) será retornada
        console.log(query.sql); // Faz o log para facilitar o debuging to código
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
			// caso o tamanho do objeto que contém os resultados a leitura (rows) estiver vazio (rows.length == 0), estão o 
			// servidor devolve a mensagem a indicar que não foram encontrado resultados, caso contrário devole os dados 
			// obtidos (row)
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

// Função com o mesmo objetivo da função read mas aplica um filtro (id), ou seja, apenas retorna os dados de um determinado id
function readID(req, res) {
    // Criar e executar a query de leitura na BD para um ID específico
    const idsponsor = req.sanitize('id').escape();
    const post = { idSponsor: idsponsor };
    const query = connect.con.query('SELECT idSponsor, nome, logo,categoria, link, active FROM sponsor where idSponsor = ? order by idSponsor desc ', post, function(err, rows, fields) {
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

// Função que permite gravar dados enviados para o servidors (em req) da tavela sponsor
function save(req, res) {
    // Receber os dados do formuário que são enviados por post (enviados no formulário post), que são lidos e higienizados (com
	// sanitize e escape), sendo posteriormente validados através do checkBody
    const nome = req.sanitize('nome').escape();
    const logo = req.sanitize('logo').escape();
    const categoria = req.sanitize('categoria').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-z ]+$/i); // O nome aceita apenas texto
    req.checkBody("categoria", "Insira apenas texto").optional({ checkFalsy: true }).matches(/^[a-z ]+$/i); // A categoria aceita apenas texto
    req.checkBody("logo", "Insira um url válido.").optional({ checkFalsy: true }).isURL(); // O envio do logo é opcional
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
		// Verifica se os campos nome e categoria (que são obrigatórios) contêm dados
        if (nome != "NULL" && categoria != "NULL" && typeof(nome) != 'undefined') {
			// Criação de uma constante (com nome post) que associa os dados do formulário que foram recebidos e higienizados aos parâmetros 
			// da base de dados, a necessidade de criar esta constante prende-se comquestões de segurança pois a utilização de ? na query
			// implica que esta não está completa loga a operação na base de dados só é realizada após a alteração do ? pelo conteúdo de post
            const post = { nome: nome, logo: logo, categoria: categoria };
            // Criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO sponsor SET ?', post, function(err, rows, fields) {
                console.log(query.sql);
				// Se a operação de BD não der error será retornada uma mensagem JSON a indicar que a operação foi realizada com sucesso
                if (!err) {
                    res.status(jsonMessages.db.successInsert.status).location(rows.insertId).send(jsonMessages.db.successInsert);
                }
                else { // Caso seja encontrado um erro é enviada uma mesagem JSON descritiva
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            });
        }
        else // Caso os dados enviados pelo formulário sejam do tipo null então é enviada a mensagem JSON a indicar que os campos obrigatórios estão em falta
            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
}

// Criar e executar a query de update na BD (tabela sponsor), o processo é semelhante à função save mas em vez de serem inseridos dados novos,
// são alterados os dados de um determinado id
function update(req, res) {
    const nome = req.sanitize('nome').escape();
    const logo = req.sanitize('logo').escape();
    const categoria = req.sanitize('categoria').escape();
    const idsponsor = req.sanitize('id').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("categoria", "Insira apenas texto").optional({ checkFalsy: true }).matches(/^[a-z ]+$/i);
    req.checkBody("logo", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idsponsor != "NULL" && typeof(nome) != 'undefined' && typeof(categoria) != 'undefined' && typeof(idsponsor) != 'undefined') {
            const update = [nome, categoria, logo, idsponsor];
            const query = connect.con.query('UPDATE sponsor SET nome =?, categoria =?, logo=? WHERE idSponsor=?', update, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
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
}

// Função para realizar o delete lógico (faz o update da variável active para o valor 0 a um determinado idSponsor passado no formulário)
function deleteL(req, res) {
    const update = [0, req.sanitize('id').escape()];
    const query = connect.con.query('UPDATE sponsor SET active = ? WHERE idSponsor=?', update, function(err, rows, fields) {
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

// Funçãop para realizar o delete físico (elimina um determinado idSponsor de forma definitiva da tabela sponsor)
function deleteF(req, res) {
    const update = req.sanitize('id').escape();
    const query = connect.con.query('DELETE FROM sponsor WHERE idSponsor=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDeleteU.status).send(jsonMessages.db.successDeleteU);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

// Exportação dos módulos
module.exports = {
    read: read,
    readID: readID,
    save: save,
    update: update,
    deleteL: deleteL,
    deleteF: deleteF,
}
