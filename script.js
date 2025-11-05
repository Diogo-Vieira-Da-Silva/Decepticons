 let url = "http://localhost:3000/soldados"
let nome = document.getElementById("nome")
let modo_alternativo = document.getElementById("modo_alternativo")
async function carregaDados(){
    await fetch(url)
    .then((response) => {
        return response.json()
    }
    )
    .then((data) => {
        console.log(data)
        nome.innerHTML = data[0].nome
        modo_alternativo.innerHTML = data[0].modo_alternativo
    })
    .catch((error) => {
        console.log("Erro no carregamento do banco de dados: " + error);
    })
    }
    carregaDados()


    //async function carregaUsuarios(){const.resposta = await fetch("/users") const usuarios = await resposta.json (); } carregaUsuarios