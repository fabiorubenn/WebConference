// JS usado para gestão dos oradores pelo administrador

const urlBase = "https://fcawebbook.herokuapp.com"
let isNew = true

window.onload = () => {
    // References to HTML objects   
    const tblSpeakers = document.getElementById("tblSpeakers")
    const frmSpeaker = document.getElementById("frmSpeaker")

    // pedido HTTP para inserção dos dados do orador; um argumento (event) é passado à função para invocar o 
    // método preventDefault que irá cancelar a submissão do formulário pois os dados serão submetidos
    // atravéz da API Fetch
    frmSpeaker.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtName = document.getElementById("txtName").value
        const txtJob = document.getElementById("txtJob").value
        const txtPhoto = document.getElementById("txtPhoto").value
        const txtFacebook = document.getElementById("txtFacebook").value
        const txtTwitter = document.getElementById("txtTwitter").value
        const txtLinkedin = document.getElementById("txtLinkedin").value
        const txtBio = document.getElementById("txtBio").value
        const txtSpeakerId = document.getElementById("txtSpeakerId").value

        // Verifica flag isNew para saber se se trata de uma adição (a flag tem valor true) ou de um atualização 
        // (a flag tem valor false) dos dados de um orador
        let response
        if (isNew) {
            // a adição de um novo orador é feita através de uma dupla ação, primeiro é adicionado o orador ao
            // sistema e depois o orador é associado à conferência WebConfernce (a base de dados fois desenvolvida
            // para gerir vária conferências em paralelo, neste exemplo estamos a trabalhar na conferên 1, logo no
            // URL indica-se: .../conferences/1/... ); para o primeiro passo o novo orador é inserido na base de 
            // dados usando um pedido post para o endpoint ${urlBase}/speakers, os dados do formulário são passados
            // no corpo do pedido, incluído como valor da chave "body" do método Fetch
            response = await fetch(`${urlBase}/speakers`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `nome=${txtName}&cargo=${txtJob}&foto=${txtPhoto}&facebook=${txtFacebook}&twitter=${txtTwitter}&linkedin=${txtLinkedin}&bio=${txtBio}&active=1`
            })
            // para obter a resposta no formato JSON poderia ser usado: const newSpeakerId = await response.json()
            // contudo, para serviços REST é usual o identificador do novo ser devolvido no cabeçalho "Location"
            // da resposta, loga esta metodologia foi usada nesta aplicão:
            const newSpeakerId = response.headers.get("Location")
            // o identificador do novo recurso devolvido em "Location" é usado para definir o novo endpoint responsável
            // pela associação do novo orador à conferência WebConfernce (número 1)
            const newUrl = `${urlBase}/conferences/1/speakers/${newSpeakerId}`
            // associa o novo orador à conferência WebConfernce
            const response2 = await fetch(newUrl, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            })
            const newSpeaker2 = await response2.json()
            if (newSpeaker2.status === 200) {
                swal("Submissão com sucesso")
            }
            else {
                swal("Erro ao submeter")
            }
        } else {
            // quando a flag isNew é false significa que o administrador está a atulizar os dados de um orador e 
            // o URL com endpoit para esta atualização é defino em "document.getElementById("txtSpeakerId").value = speaker.idSpeaker"
            // sendo este elemento do formulário definido como tipo hidden (type="hidden" definido no ficheiro 
            // HTML: speakers.html), ou seja, um elemento que existe na estrutura lógica do formulário mas que 
            // não é renderizado, este pedido é feito usando o método HTTP put (também poderia ter sido usado o 
            // método POST que é mais seguro mas o PUT é mais simples)
            response = await fetch(`${urlBase}/speakers/${txtSpeakerId}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${txtName}&cargo=${txtJob}&foto=${txtPhoto}&facebook=${txtFacebook}&twitter=${txtTwitter}&linkedin=${txtLinkedin}&bio=${txtBio}&active=1`
            })
            const newSpeaker = await response.json()
            if (newSpeaker.status === 200) {
                swal("Atualização com sucesso")
            }
            else {
                swal("Erro ao atualizar")
            }
        }
        isNew = true
        renderSpeakers()
    })

    // apresenta os dados dos oradores na tabela com id "tblSpeakers", esta tabela contem quatro campos, o primeiro
    // para o id do orador, o segundo para o nome, o terceiro para o cardo do ordador e o quarto para as ações e terá
    // dois ícones, um lapis que ao clicar em cima permite editar informações do orador e um caixote do lixo que ao 
    // clicar em cima permite eliminar o orador
    const renderSpeakers = async () => {
        frmSpeaker.reset() // reinicia o formulário
        let strHtml = 
            `
                <thead >
                    <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Oradores</th></tr>
                    <tr class='bg-info'>
                        <th class='w-2'>#</th>
                        <th class='w-50'>Nome</th>
                        <th class='w-38'>Cargo</th>              
                        <th class='w-10'>Acao</th>              
                    </tr> 
                </thead><tbody>
            `
        // o fetch executa por defeito o método Get (se for para fazer post ou put temos de especificar) que
        // irá obter os dados dos oradores 
        const response = await fetch(`${urlBase}/conferences/1/speakers`)
        const speakers = await response.json()
        // uma uma variável de controlo i para iterar sobre todos os oradores e gera o HTML da tabela
        let i = 1
        for (const speaker of speakers) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${speaker.nome}</td>
                    <td>${speaker.cargo}</td>
                    <td>
                        <i id='${speaker.idSpeaker}' class='fas fa-edit edit'></i>
                        <i id='${speaker.idSpeaker}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblSpeakers.innerHTML = strHtml
        // gestão do clique no ícone de editar (ícone do lapiz), atribuindo um event listener para cada
        // ícone de editar (ícone do lapiz) através do ciclo for, depois indica que quando o listner
        // deteta um click então passa a informação para o formulário
        const btnEdit = document.getElementsByClassName("edit")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", () => {
                // após o registo do listener a flag "isNew" é alterada para false, esta flag vai controlar
                // o tipo de ação a ser desencadeada assim que o botão de submissão é pressionado: quando a 
                // flag é true então é feita a inserção do orador; quando a flag é false então é feita a 
                // atualização do respetivo orador (verificação realizada pela condição "if (isNew)")
                isNew = false
                // itera-se sobre todos os oradores de forma a encontrar o orador cujo identificador é
                // igual ao do ícone clicado, quando isto ocorre todos os dados do orador são passados
                // para o formulário (elementos do formulário identificados pelos id definidos em
                // speakers.html); a atribuião document.getElementById("txtSpeakerId").value = speaker.idSpeaker
                // é uma passagem para um elemento no formulário do tipo hidden (type="hidden" definido
                // no ficheiro HTML: speakers.html), ou seja, um elemento que existe na estrutura lógica
                // do formulário mas que não é renderizado, esta atribuição é usada uma vez que quando se
                // atualiza os dados no servidor temos de passar ao servidor o identificador do orador a atualizar
                // e esta informação tem de estar np URL que irá conter o endpoint específico para 
                // atualizar o orador desejado
                for (const speaker of speakers) {
                    if (speaker.idSpeaker == btnEdit[i].getAttribute("id")) {
                        document.getElementById("txtSpeakerId").value = speaker.idSpeaker
                        document.getElementById("txtName").value = speaker.nome
                        document.getElementById("txtJob").value = speaker.cargo
                        document.getElementById("txtPhoto").value = speaker.foto
                        document.getElementById("txtFacebook").value = speaker.facebook
                        document.getElementById("txtTwitter").value = speaker.twitter
                        document.getElementById("txtLinkedin").value = speaker.linkedin
                        document.getElementById("txtBio").value = speaker.bio
                    }
                }
            })
        }
        // Gestão do clique no ícone de remover (ícone do caixote do lixo), atribuindo um event listener 
        // para cada ícone de remover (ícone do caixote do lixo) através do ciclo for, depois indica que 
        // quando o listner deteta um click então pede ao servidor (usando o pedido HTTP com o método
        // delete) para remover o orador
        const btnDelete = document.getElementsByClassName("remove")
        for (let i = 0; i < btnDelete.length; i++) {
            btnDelete[i].addEventListener("click", () => {
                // ao clicar no ícone de remover (ícone do caixote do lixo) é apresentada uma janela modal
                // (swal) a pedir ao utilizador para confirmar se realmente pretende eleminar o orador
                swal({
                    title: 'Tem a certeza?',
                    text: "Não será possível reverter a remoção!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Remover'
                })
                    .then(async (result) => {
                        if (result.value) {
                            let speakerId = btnDelete[i].getAttribute("id")
                            try {
                                const response = await fetch(`${urlBase}/conferences/1/speakers/${speakerId}`, {
                                    method: "DELETE"
                                })
                                if (response.status == 204) {
                                    swal('Removido!', 'O orador foi removido da Conferência.', 'success')
                                }
                            } catch (err) {
                                swal({
                                    type: 'error',
                                    title: 'Erro',
                                    text: err
                                })
                            }
                            renderSpeakers() // atualiza a tabela com os oradores sem ter de carregar novamente a página
                        }
                    })
            })
        }
    }
    renderSpeakers() // gera a tabela com os oradores
}