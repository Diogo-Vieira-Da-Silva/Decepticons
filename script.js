 let url = "http://localhost:3000/soldados"
let nome = document.getElementById("nome")
let email = document.getElementById("email")
async function carregaDados(){
    await fetch(url)
    .then((response) => {
        return response.json()
    }
    )
    .then((data) => {
        console.log(data)
        nome.innerHTML = data[0].nome
        email.innerHTML = data[0].email
    })
    .catch((error) => {
        console.log("Erro no carregamento do banco de dados: " + error);
    })
    }
    carregaDados()


    //async function carregaUsuarios(){const.resposta = await fetch("/users") const usuarios = await resposta.json (); } carregaUsuarios