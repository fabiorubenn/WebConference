// JS usado para gestão dos participantes pelo administrador

// domínio comum de todos os endpoints de esta aplicação (o url_base)
const urlBase = "https://fcawebbook.herokuapp.com"

window.onload = () => {
    // References to HTML object
    const tblParticipants = document.getElementById("tblParticipants")

    // função arrow anónima e assíncrona para apresentar a informação dos participantes ao administrador
    const renderParticipants = async () => {
        // variável com o HTML da tabela o cabeçalho (thead) tem a largua a 100% (w-100) da página, texto centrado,
        // quatro colunas e nome "Lista de Participantes"; a primeira coluna indica o núemro da entrada
        // na tabela, a segunda o nome do participante, a tercerira o email e a quarta as acões que podem
        // ser realizadas (neste caso está defindo como eliminar a entrada); cada linha da tabela HTML
        // é definada com "tr" e a coluna com "th"
        let strHtml = 
            `
                <thead >
                    <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Participantes</th></tr>
                    <tr class='bg-info'>
                        <th class='w-2'>#</th>
                        <th class='w-50'>Nome</th>
                        <th class='w-38'>E-mail</th>              
                        <th class='w-10'>Ações</th>              
                    </tr> 
                </thead><tbody>
            `
        // usar a API fetch para pedir ao servidor os dados de todos os incritos na conferência, o pedido é
        // do tipo GET para o URL urlBase/conferences/1/participants
        const response = await fetch(`${urlBase}/conferences/1/participants`)
        // após receber a resposta é usado o método "json" para obter os dados json
        const participants = await response.json()
        // de seguida itera-se sobre todas as entradas usando o "for... of"
        let i = 1 // variável para definir o núemro da entrada (primeira coluna da tabela)
        for (const participant of participants) {          
            // adiciona o corpo da tabela (tbody), adicionando uma linha (com tr) e depois a entrada para
            // cada célula (com td), incluindo o ícone "balde do lixo" na última coluna para permitir a 
            // eliminação da entrada (eliminar o registo do participante)
            strHtml += 
                `
                    <tr>
                        <td>${i}</td>
                        <td>${participant.nomeParticipante}</td>
                        <td>${participant.idParticipant}</td>
                        <td><i id='${participant.idParticipant}' class='fas fa-trash-alt remove'></i></td>
                    </tr>
                `        
            i++ // incrementa para a próxima entrada ter o novo número
        }
        strHtml += "</tbody>"
        // adiciona o código HTML na localização "tblParticipants" com o método innerHTML
        tblParticipants.innerHTML = strHtml 
        // gestão da eliminação de incrições usando um listener associado ao botão (é o ícone
        // "balde do lixo" da última coluna)
        const btnDelete = document.getElementsByClassName("remove")
        // primiero percorre-se todas as linhas da tabela e adiciona-se um event listener para
        // cada uma das linhas (um event listner para cada ícone "balde do lixo"), que reagem
        // ao click sobre o ícone "balde do lixo"
        for (let i = 0; i < btnDelete.length; i++) {
            // event listener associado ao click que chama uma função arrow sem parametros
            btnDelete[i].addEventListener("click", () => {
                // apresenta uma janela modal (swal) do tipo warning para que o utilizador confirme 
                // que pretende eliminar o registo do participante, a janela apresenta uma mensagem 
                // e tem dois butões, um para cancelar a eliminação e outro para confirmar a eliminação
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
                    .then( async (result) => {
                        if (result.value) {    
                            // obtem o identificador do inscrito a remover
                            let participantId = btnDelete[i].getAttribute("id")
                            try {
                                // pedido HTTP (feito ao servidor) para remoção da inscrição com URL 
                                // construido com base no identificador do inscrito a remover, o 
                                // HTTP delete é um método que representa um pedido de remoção de 
                                // recursos no servidor; os pedidos HTTP são sempre agrupados numa
                                // estrutura try-catch, apresentado uma janela modal em casso de erro
                                const response = await fetch(`${urlBase}/conferences/1/participants/${participantId}`, {
                                    method: "DELETE"
                                })
                                const isRemoced = await response.json()
                                // se o pedido de remoção for bem sucedido então uma nova janela modal
                                // é apresentada ao utilizador com a confirmação; o texto e o tipo de 
                                // janela modal (success ou error) são determinados de acordo com os
                                // valores das chaves message.pt e success da resposta json
                                swal('Removido!',isRemoced.message.pt,(isRemoced.success) ? "success" : "error")
                                renderParticipants() // chama a função para atualizar a página a lista na janela
                            } catch(err) {
                                swal({type: 'error', title: 'Remoção da inscrição', text: err})
                            }
                        } 
                  })
            })
        }       
    }
 renderParticipants() // chama a função
}