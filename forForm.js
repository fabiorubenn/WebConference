let frm = document.getElementById("frm")
frm.addEventListener("submit", function(event){
    let pass1 = document.getElementById("pass1")
    let pass2 = document.getElementById("pass2")
    if (pass1.value != pass2.value){
        alert("Passwords são diferentes")
    }
    else {
        alert("Password aceite")
    }
    event.preventDefault
})