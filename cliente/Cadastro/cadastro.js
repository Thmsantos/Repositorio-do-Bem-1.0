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

function cadastrar(event) {
    event.preventDefault(); 
    fetch("http://localhost:5555/getAllUsuarios")
        .then((res) => {
            return res.json()
        })
        .then((res) => {

            let nomeInput = document.getElementsByClassName("nome")
            let nome = nomeInput[0].value

            let emailInput = document.getElementsByClassName("email")
            let email = emailInput[0].value

            let cnpjinput = document.getElementsByClassName("cnpj")
            let cnpj = cnpjinput[0].value

            let cepInput = document.getElementsByClassName("cep")
            let cep = cepInput[0].value

            let senhaInput = document.getElementsByClassName("senha")
            let senha = senhaInput[0].value

            //let obj = {"nome": nome, "email": email, "cnpj": cnpj, "cep": cep, "senha": senha}

            let count = 0;

            for (let i = 0; i < res.length; i++) {
                if (nome != res[i].nomeEmpresa && email != res[i].email && cnpj != res[i].cnpj) {
                    count++
                }
            }

            if (count == res.length) {
                fetch("http://localhost:5555/saveUsuario", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "cnpj": cnpj,
                        "nomeEmpresa": nome,
                        "cep": cep,
                        "email": email,
                        "senha": senha
                    })
                })
                customAlert("CADASTRADO");
                setTimeout(function() {
                    document.location.href = '../login/login.html';
                }, 2000);

            } else {
                customAlert("JÁ EXISTENTE");
            }

        })

}

