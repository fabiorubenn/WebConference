// começar por manipular o obejto window de forma a que o código seja executado
// assim que o conteúdo HTML esteja carregado em memória  epossa ser manipilado 
// pelo Document Object Model (DOM)
window.onload = function(){
    // domínio comum de todos os endpoints de esta aplicação (o url_base)
    const urlBase = "https://fcawebbook.herokuapp.com"

    // ##################### código para manipulação DOM #####################

    // implementação de um event listner para cada botão (para o botão de 
    // realização do login que trata a ação de clicar no botão; é necessário 
    // obter a referência ao botão na DOM e depois o evento click irá chamar 
    // uma função anónima que permitirá a abertura de uma janela modal)
    const btnLogin = document.getElementById("btnLogin")
    const btnRegister = document.getElementById("btnRegister")
    const aSponsors = document.getElementById("aSponsors")

    // ############## Autenticar administrador na área privada ##############
    // abertura da janela modal (usando o médodo swal do sweetalert2 importado
    // no final do "index.html") para tratar o pressionar (click) do botão
    // btnLogin, a janéla tem duas caixas de texto (uma para o nome e outra para
    // o email) e dois botões (um para submeter, denominado entrar, e outro para 
    // cancelar), ao precionar entrar o nome e o email são  incluidos num pedido 
    // post e enviados a um endpoit da API webconference do backend
    btnLogin.addEventListener("click", function() {
        swal({
            // titulo da janela
            title: "Acesso à área de gestão da WebConference",
            // bloco de HTML a ser renderizado no interior da janela modal
            html:
                '<input id="txtEmail" class="swal2-input" placeholder="e-mail">' +
                '<input id="txtPass" class="swal2-input" placeholder="password">',      
            // definição dos botões
            showCancelButton: true,
            confirmButtonText: "Entrar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            // função a ser executada antes de mostrar ao utilizador a confirmação
            // da submissão do login
            preConfirm: () => {
                // obtem os valores introduzidos pelo utilizador nas caixas de texto
                const email = document.getElementById('txtEmail').value
                const pass = document.getElementById('txtPass').value
                // usar o método fetch da API fetch (retorna um objeto promise) e 
                // este método está definido no objeto window; neste caso a API fetch
                // faz um pedido "post" ao servidor (está no back end) e retorna o 
                // objeto promise, sendo o pedido "post" feito ao domínio comum
                // de todos os endpoints de esta aplicação (o urlBase que é o URL
                // base para todos os pedidos); neste pedido (com o método post) 
                // são enviados no corpo (body) os valores das caixas de texto que
                // o utilizador introsuziu; o content-type especifica como os dados 
                // do formuário devem ser codificados ao serem enviados para o 
                // servidor (somente quando method="post"), para application/x-www-form-urlencoded, 
                // o corpo da mensagem HTTP enviada para o servidor é essencialmente 
                // uma sequência de consulta, nome / valor são separados por &, e 
                // os nomes são separados dos valores usando = (para grandes arquivos
                // deve ser usado o form-data em vez de x-www-form-urlencoded)
                return fetch(`${urlBase}/signin`, {
                    headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                    },          
                    method: "POST",
                    body: `email=${email}&password=${pass}`
                })
                    // o metodo "then" é usado para aguardar a resposta do servidor 
                    // (ou seja quando a promise é comprida, sinificando que recebeu
                    // os dados do servidor), caso a resposta não seja "ok" então
                    // ocorreu um erro e o JS irá gerar (throw) uma mensagem de erro,
                    // caso contrário o objeto "response" é obtido e este contem o
                    // payload (os dados) do servidor com o conteudo retornado 
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    // caso o objeto promise seja rejetado entºao executamos o
                    // callback do catch para apresentar a mensagem de erro ao 
                    // utilizador
                    .catch(error => {
                        swal.showValidationError(`Pedido falhado: ${error}`);
                    });
            },
            // quando allowOutsideClick está definido como falso implica que o
            // utilizador não pode sair da janela modal ao clicar fora da janela
            allowOutsideClick: () => !swal.isLoading()
        // analisa o objeto "response" que o servidor enviou
        }).then(result => {
            // indica ao utilizador se a autenticação foi bem sucedida ou se 
            // ocorreu um erro (por exemplo pode já ter um email igual ao
            // introduzido na base de dados logo gera um erro)
            console.log(result.value)
            if (result.value.sucesss) {                       
                swal({title: "Autenticação feita com sucesso!"})
                window.location.replace("admin/participants.html")  
            } else {
                swal({title: `${result.value.message.pt}`})  
            }
        });
    });

    // ############## Registar participante ##############
    // abertura da janela modal para tratar o click do botão btnRegister
    btnRegister.addEventListener("click", function() {
        swal({
        title: "Inscrição na WebConference",
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="nome">' +
            '<input id="swal-input2" class="swal2-input" placeholder="e-mail">',      
        showCancelButton: true,
        confirmButtonText: "Inscrever",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const name = document.getElementById('swal-input1').value
            const email = document.getElementById('swal-input2').value
            return fetch(`${urlBase}/conferences/1/participants/${email}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },          
                method: "POST",
                body: `nomeparticipant=${name}`
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .catch(error => {
                    swal.showValidationError(`Request failed: ${error}`);
                });
        },
        allowOutsideClick: () => !swal.isLoading()
        }).then(result => {
            if (result.value) {               
                if (!result.value.err_code) {
                    swal({title: "Inscrição feita com sucesso!"})  
                } else {
                    swal({title: `${result.value.err_message}`})  
                }
            }
        });
    });

    // ############## Obter informações dos speakers a partir do servidor ##############
    // uso de uma função assíncrona (abreviada com o usa de uma função arrow, =>) com a 
    // API Fetch para obter os dados dos oradores; a API devolve o objeto promise e o
    // "await" vai aguardar pela resolução do promise (obtenção dos dados) e depois
    // vai examinar os dados (no formato JSON e presentes em rensponse), fazendo uma
    // iteração sobre os mesmos usando um ciclo "for...of"; neste ciclo é alimentada 
    // a variavel txtSpeakers que irá conter os elementos HTML que vão construir o layout
    // a ser renderizado no browser (a sua construção é influenciada pelos dados JSON de
    // cada iteração do ciclo "for...of"), em HTML será criada uma coluna para cada
    // orador, contendo uma imagem (presente em "speaker.foto") do mesmo (no interior de 
    // um círculo), um paragrafo com o texto a indicar o nome do orador, um segundo 
    // paragrafo com o texto a indicar o cargo do orador, caso tenha informação das 
    // redes sociais do orador (na base de dados) também são criados ícones (fab) para  
    // o twitter, facebook e linkedin; a class "viewSpeaker" aplicada à imagem será
    // usada depois para adicionar um listener ao evento de clicar sobre a imagem
    // para mostrar uma biografia do orador
    (async () => {
        const renderSpeakers = document.getElementById("renderSpeakers")
        let txtSpeakers = ""
        const response = await fetch(`${urlBase}/conferences/1/speakers`)
        const speakers = await response.json()
        for (const speaker of speakers) {
            txtSpeakers += `
                <div class="col-sm-4">
                    <div class="team-member">      
                        <img id="${speaker.idSpeaker}" class="mx-auto rounded-circle viewSpeaker" src="${speaker.foto}" alt="">
                        <h4>${speaker.nome}</h4>
                        <p class="text-muted">${speaker.cargo}</p>
                        <ul class="list-inline social-buttons">`
                        if (speaker.twitter!==null) {
                            txtSpeakers += `
                            <li class="list-inline-item">
                                <a href="${speaker.twitter}" target="_blank">
                                <i class="fab fa-twitter"></i>
                                </a>
                            </li>`
                        }
                        if (speaker.facebook!==null) {
                            txtSpeakers += `
                            <li class="list-inline-item">
                                <a href="${speaker.facebook}" target="_blank">
                                <i class="fab fa-facebook-f"></i>
                                </a>
                            </li>`
                        }    
                        if (speaker.linkedin!==null) {
                            txtSpeakers += `
                            <li class="list-inline-item">
                                <a href="${speaker.linkedin}" target="_blank">
                                <i class="fab fa-linkedin-in"></i>
                                </a>
                            </li>`
                        }
            txtSpeakers += `                
                        </ul>
                    </div>
                </div>
            `    
        }
        // adiciona a informação dos oradores no div da pagína HTML com id="renderSpeakers"
        renderSpeakers.innerHTML = txtSpeakers
        // ao clicar na imagem do orador também será apresentada uma biografia do mesmo, para
        // tal foi adicionada a class "viewSpeaker" à imagem para permitir adicionar o 
        // event listner ao click na mesma; na prática, será adicionado um listener à imagem  
        // de cada orador (por isso é examinado "btnView.length" para ver todos os oradores);
        // o listener é aplicado ao "click" na imagem e quando o click ocorre o ciclo 
        // "for (const speaker of speakers)" determina em qual imagem foi clicada e depois 
        // cria uma janela janela modal (usando o médodo swal do sweetalert2 importado
        // no final do "index.html") com o nome, biografia e imagem (400 por 400 sem animação)
        // do orador
        const btnView = document.getElementsByClassName("viewSpeaker")
        for (let i = 0; i < btnView.length; i++) {
            btnView[i].addEventListener("click", () => {         
                for (const speaker of speakers) {
                    if (speaker.idSpeaker == btnView[i].getAttribute("id")) {
                        swal({
                            title: speaker.nome,
                            text: speaker.bio,
                            imageUrl: speaker.foto,
                            imageWidth: 400,
                            imageHeight: 400,
                            imageAlt: 'Foto do orador',
                            animation: false
                        })                 
                    }
                }
            })
        }

    })(); // o uso de () aqui é para a função ser autoinvocada através da técnica IIFE (Immediatly Invoked Function Expression)
}