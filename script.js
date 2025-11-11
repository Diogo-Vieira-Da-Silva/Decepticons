let url = "http://localhost:3000/soldados"
let nome = document.getElementById("nome")
let modo_alternativo = document.getElementById("modi_alternativo")
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


    const form = document.getElementById("form");
const lista = document.getElementById("lista");

// Função para carregar usuários
async function carregarSoldados() {
  const resposta = await fetch("/soldados");
  const soldados = await resposta.json();
  console.log(soldados);

  lista.innerHTML = "";
  soldados.forEach((u) => {
    const li = document.createElement("li");
    li.textContent = `${u.nome} - ${u.modo_alternativo}`;
    lista.appendChild(li);
  });
}

// Função para enviar novo usuário
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("modo_alternativo").value;

  await fetch("/soldados", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, modo_alternativo }), // manda o objeto js para o banco como json
  });

  form.reset(); // limpa os campos com a função nativa para tags form
  carregarSoldados(); // atualiza lista
});

// Carrega ao abrir a página
carregarSoldados();
    carregaDados()
    //async function carregaUsuarios(){const.resposta = await fetch("/users") const usuarios = await resposta.json (); } carregaUsuarios