//Configurações do menu
var btn = document.querySelector('#menu-btn')
var menu = document.querySelector('#menu-list')

btn.addEventListener('click', function () {
  menu.classList.toggle('expandir')
})

//Config perfil
var btnPerfil = document.querySelector('#user-icon')
var perfil = document.querySelector('#perfil-list')

btnPerfil.addEventListener('click', function () {
  perfil.classList.toggle('expand')
})

//Configurações do modal

// Seleciona o botão e o modal
var btnModal = document.getElementById("btn-add");
var modal = document.getElementById("modal");

// Seleciona o elemento que fecha o modal
var closeBtn = document.getElementsByClassName("close")[0];

// Quando o usuário clicar no botão, o modal é exibido
btnModal.onclick = function () {
  modal.style.display = "block";
}

// Quando o usuário clicar no "x", o modal é ocultado
closeBtn.onclick = function () {
  modal.style.display = "none";
}

// Quando o usuário clicar fora do modal, ele é ocultado
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// Botão de adicionar do modal
var addBtn = document.getElementById("btn-adc");

addBtn.onclick = function () {
  let inputAlimento = document.getElementById("input01").value.trim();
  let inputValidade = document.getElementById("input03").value.trim();


  if (inputAlimento === "" || inputValidade === "") {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  modal.style.display = "none";

  alert("Alimento adicionado");

  // Adicionar o alimento ao servidor
  let nomeMinusculo = inputAlimento.toLowerCase();
  let nomeFormatado = nomeMinusculo
    .replace(/[áàãâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòõôö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/[ç]/g, 'c');


  fetch('http://localhost:5555/saveAlimento', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "nome": nomeFormatado,
      "peso": "",
      "validade": inputValidade,
      "idDoador": "5",
      "emailDoador": ""
    })
  });

  window.location.reload();
};

//get alimentos
let alimentos = []
let QuantidadeAlimentos = []
let qtdUnidade = new Array(alimentos.length).fill(0)
let validade = new Array(alimentos.length).fill(0)
fetch('http://localhost:5555/getAllAlimentos')
  .then((res) => {
    return res.json();
  })
  .then((data) => {

    let idsFor = []
    for (let i = 0; i < data.length; i++) {
      let objID = { "id": data[i].alimentoId, "alimento": data[i].nome }
      idsFor.push(objID);

      if (!alimentos.includes(data[i].nome)) {
        alimentos.push(data[i].nome)
      }

      validade.push(data[i].validade)

    }

    let h = new Array(alimentos.length).fill(0)
    for (let i = 0; i < data.length; i++) {
      let alimentoMinusculo = data[i].nome.toLowerCase()

      let alimentoFormatado = alimentoMinusculo
        .replace(/[áàãâä]/g, 'a')
        .replace(/[éèêë]/g, 'e')
        .replace(/[íìîï]/g, 'i')
        .replace(/[óòõôö]/g, 'o')
        .replace(/[úùûü]/g, 'u')
        .replace(/[ç]/g, 'c');


      for (let j = 0; j < h.length; j++) {
        if (alimentoFormatado === alimentos[j]) {
          h[j] = h[j] + 1;
        }
      }
    }

    for (let i = 0; i < alimentos.length; i++) {

      const nomeAlimento = `
      <p>${alimentos[i]}</p>
      `

      /* const Quantidade = `
      <p>${h[i]}</p>
      ` */

      const validadeTag = `
      <p>${validade[i]}</p>
      `
      const check = `
      <input type="checkbox" class="input${i}" id="checkbox${i} placeholder="selecione">
      <br color="white">
      `

      document.querySelector("#checkbox").insertAdjacentHTML("beforeend", check)
      document.querySelector("#nomeAlimento").insertAdjacentHTML("beforeend", nomeAlimento)
      document.querySelector("#validade").insertAdjacentHTML("beforeend", validadeTag)
      /* document.querySelector("#Quantia").insertAdjacentHTML("beforeend", Quantidade) */

    }

    QuantidadeAlimentos = h

    //adicionando grafico
    /* criarGrafico(h); */
  })

function fazerDoacao() {
  fetch('http://localhost:5555/getAllAlimentos')
    .then((res) => {
      return res.json();
    })
    .then((data) => {

      let idsFor = []
      for (let i = 0; i < data.length; i++) {
        let idAlimento = data[i].alimentoId
        idsFor.push(idAlimento);
      }

      let alimentosDoados = []
      let inputs = new Array(QuantidadeAlimentos.length).fill(0)
      let tdElemento = document.getElementById("checkbox")

      for (let i = 0; i < QuantidadeAlimentos.length; i++) {
        inputs[i] = tdElemento.getElementsByClassName(`input${i}`)
      }

      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i][0].checked === true) {
          let obj = { "id": idsFor[i], "alimento": alimentos[i], "quantidade": QuantidadeAlimentos[i] }
          alimentosDoados.push(obj)
        }
      }

      if (alimentosDoados.length == 0) {
        alert("Escolha os itens para doação!")
      } else {
        for (let i = 0; i < alimentosDoados.length; i++) {
          fetch(`http://localhost:5555/deleteAlimento/${alimentosDoados[i].id}`, {
            method: 'DELETE'
          })
        }
        window.location.reload();
        let documentoPDF = new jsPDF();

        let htmlContent = `
      <html>
        <head>
          <title>Relatório de Doação</title>
          <style>
            *{
              font-family="Poppins"
            }
            h2, h3{
              font-size: 30px
            }
          </style>
        </head>
        <body>
          <h2>Alimentos Doados:</h2>
          <ul>
    `;

        for (let i = 0; i < alimentosDoados.length; i++) {
          htmlContent += `<li><h3>${alimentosDoados[i].alimento}</h3></li><br>`;
        }

        htmlContent += `
            </ul>
          </body>
        </html>
    `;
        documentoPDF.fromHTML(htmlContent, 35, 2, {}, function () {
          documentoPDF.save('Doacao.pdf');
        });
      }
    })


}

let alimentoPesquisado = ""
let qtdAlimentoPesquisado = 0

function pesquisar() {
  const searchInputSemFormatacao = document.querySelector("#busca").value;
  let searchInputMinusculo = searchInputSemFormatacao.toLowerCase();
  let searchInput = searchInputMinusculo
    .replace(/[áàãâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòõôö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/[ç]/g, 'c');

  let verificacaoTabela = false

  for (let i = 0; i < alimentos.length; i++) {
    if (searchInput === alimentos[i]) {

      alimentoPesquisado = searchInput
      qtdAlimentoPesquisado = QuantidadeAlimentos[i]

      const nomeAlimento = `
        <p style="background-color: yellow; color: black;">${alimentoPesquisado}</p>
        `

      const Quantidade = `
        <p border=0px solid(white) style="background-color: yellow; color: black;">${qtdAlimentoPesquisado}</p>
        `
      document.querySelector("#nomeAlimentoPesquisado").insertAdjacentHTML("beforeend", nomeAlimento)
      document.querySelector("#QuantiaPesquisado").insertAdjacentHTML("beforeend", Quantidade)

      verificacaoTabela = true

    }
  }

  if (verificacaoTabela == false) {
    alert("ALIMENTO NÃO ENCONTRADO")
  }
}

function criarGrafico(data_qtd) {

  var tagGrafico = document.getElementById('myChart').getContext('2d');

  var myChart = new Chart(tagGrafico, {
    type: 'bar',
    data: {
      labels: alimentos,
      datasets: [{
        label: '# of Votes',
        data: data_qtd,
        backgroundColor: [
          "#FFA500CC", "#800080CC", "#00FFFFCC", "#FFD700CC", "#FF0000CC",
          "#00FF7FCC", "#FF8C00CC", "#FF6347CC", "#800080CC", "#FFA500CC",
          "#FF6347CC", "#FF6347CC", "#FF6347CC", "#FF6347CC", "#800080CC",
          "#800080CC", "#4682B4CC", "#FF6347CC", "#FF6347CC", "#FF6347CC",
          "#FF6347CC", "#4682B4CC", "#FFD700CC", "#800080CC", "#FF6347CC",
          "#FF0000CC", "#FF0000CC", "#800080CC", "#FF6347CC", "#FFA500CC",
          "#FF0000CC", "#FF6347CC", "#FF6347CC", "#FF0000CC", "#FFA500CC",
          "#FF0000CC", "#00FF7FCC", "#FFA500CC", "#800080CC", "#FF0000CC",
          "#800080CC", "#FFA500CC", "#800080CC", "#FF6347CC", "#FFA500CC",
          "#00FFFFCC", "#00FF7FCC", "#800080CC", "#FF6347CC", "#FFA500CC",
          "#FFA500CC", "#800080CC", "#FF6347CC", "#800080CC", "#FFD700CC",
          "#FFA500CC", "#800080CC", "#FF6347CC", "#FFA500CC", "#800080CC",
          "#00FFFFCC", "#FFA500CC", "#FFA500CC", "#FF0000CC", "#FFD700CC",
          "#FF6347CC", "#FF6347CC", "#FFD700CC", "#FF6347CC", "#FF0000CC",
          "#FF0000CC", "#FFD700CC", "#800080CC", "#FF6347CC", "#FFA500CC",
          "#00FF7FCC", "#FF0000CC", "#FFA500CC", "#800080CC", "#FF6347CC",
          "#800080CC", "#FF0000CC", "#FF0000CC", "#800080CC", "#FFA500CC",
          "#FF6347CC", "#FFA500CC", "#FF6347CC", "#800080CC", "#00FFFFCC",
          "#FF0000CC", "#FFA500CC", "#FFD700CC", "#FF6347CC", "#FF6347CC",
          "#FFA500CC", "#FFA500CC", "#FF0000CC", "#FFA500CC", "#FFA500CC",
          "#FF0000CC", "#800080CC", "#FF6347CC", "#FFA500CC", "#FF6347CC"
        ],
        borderColor: [
          "#FFA500", "#800080", "#00FFFF", "#FFD700", "#FF0000",
          "#00FF7F", "#FF8C00", "#FF6347", "#800080", "#FFA500",
          "#FF6347", "#FF6347", "#FF6347", "#FF6347", "#800080",
          "#800080", "#4682B4", "#FF6347", "#FF6347", "#FF6347",
          "#FF6347", "#4682B4", "#FFD700", "#800080", "#FF6347",
          "#FF0000", "#FF0000", "#800080", "#FF6347", "#FFA500",
          "#FF0000", "#FF6347", "#FF6347", "#FF0000", "#FFA500",
          "#FF0000", "#00FF7F", "#FFA500", "#800080", "#FF0000",
          "#800080", "#FFA500", "#800080", "#FF6347", "#FFA500",
          "#00FFFF", "#00FF7F", "#800080", "#FF6347", "#FFA500",
          "#FFA500", "#800080", "#FF6347", "#800080", "#FFD700",
          "#FFA500", "#800080", "#FF6347", "#FFA500", "#800080",
          "#00FFFF", "#FFA500", "#FFA500", "#FF0000", "#FFD700",
          "#FF6347", "#FF6347", "#FFD700", "#FF6347", "#FF0000",
          "#FF0000", "#FFD700", "#800080", "#FF6347", "#FFA500",
          "#00FF7F", "#FF0000", "#FFA500", "#800080", "#FF6347",
          "#800080", "#FF0000", "#FF0000", "#800080", "#FFA500",
          "#FF6347", "#FFA500", "#FF6347", "#800080", "#00FFFF",
          "#FF0000", "#FFA500", "#FFD700", "#FF6347", "#FF6347",
          "#FFA500", "#FFA500", "#FF0000", "#FFA500", "#FFA500",
          "#FF0000", "#800080", "#FF6347", "#FFA500", "#FF6347"
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function QueroDoar() {
  window.location.href = '../Ponto_coleta/ponto_coleta.html'
}

function Estoque() {
  window.location.href = '../estoque/estoque.html'
}

function GerarPdf() {
  fetch('http://localhost:5555/getAllAlimentos')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.length == 0) {
        alert("ESTOQUE VAZIO!")
      } else {

        let documentoPDF = new jsPDF();

        let htmlContent = `
          <html>
            <head>
              <title>Relatório de Alimentos</title>
              <style>
                *{
                  font-family="Poppins"
                }
                h2, h3{
                  font-size: 30px
                }
              </style>
            </head>
            <body>
              <h2>Lista de Alimentos:</h2>
              <ul>
        `;

        for (let i = 0; i < alimentos.length; i++) {
          htmlContent += `<li><h3>${alimentos[i]} - Quantidade = ${QuantidadeAlimentos[i]}</h3></li>`;
        }

        htmlContent += `
                </ul>
              </body>
            </html>
        `;
        documentoPDF.fromHTML(htmlContent, 35, 2, {}, function () {
          documentoPDF.save('Relatorio.pdf');
        });
      }
    })

}




