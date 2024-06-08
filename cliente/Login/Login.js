function customAlert(message) {
    var customAlert = document.getElementById("custom-alert");
    var customAlertMessage = document.getElementById("custom-alert-message");
    customAlertMessage.innerText = message;
    customAlert.style.display = "block";
}

function closeCustomAlert() {
    var customAlert = document.getElementById("custom-alert");
    customAlert.style.display = "none";
}

function Logar(event) {
    fetch("http://localhost:5555/getAllUsuarios")
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            let emailInput = document.getElementsByClassName("email")
            let email = emailInput[0].value

            let cnpjinput = document.getElementsByClassName("cnpj")
            let cnpj = cnpjinput[0].value

            let senhaInput = document.getElementsByClassName("senha")
            let senha = senhaInput[0].value

            let count = 0

            for (let i = 0; i < res.length; i++) {
                if (email === res[i].email && cnpj === res[i].cnpj && senha === res[i].senha) {
                    count++
                }
            }

            if (count >= 1) {
                customAlert("LOGIN FEITO");
                setTimeout(function() {
                    document.location.href = '../estoque/estoque.html';
                }, 2000);
               
            } else {
                alert("INVÁLIDO!")
            }
        })
    event.preventDefault();
}