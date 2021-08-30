// usando o objeto raiz "window"
window.onload = function(){
    let result = document.getElementById("resultButt2")
    let button = document.getElementById("myButton2")
    button.onclick = function(){
        result.innerHTML = new Date()
    }
}

// usando event listner
document.getElementById("myButton3").addEventListener("click", function(){
    document.getElementById("resultButt3").innerHTML = new Date()
})

// usar o event listner para mudar a cor do fundo da caixa de txto quando movemos o rato
document.getElementById("myButton3").addEventListener("mouseleave", function(){
    document.getElementById("resultButt3").style .backgroundColor = "blue"
})