 document.addEventListener("DOMContentLoaded", () => {

  const formSoldados = document.getElementById("formSoldados");
  const listaSoldados = document.getElementById("listaSoldados");
  const formMedicos = document.getElementById("formMedicos");
  const listaMedicos = document.getElementById("listaMedicos");

  const sTerm = document.getElementById("searchSoldadoTerm");
  const sBtn = document.getElementById("buscarSoldado");
  const sClear = document.getElementById("limparSoldado");
  const sRes = document.getElementById("searchSoldadoResults");
  const nomeSoldadoDetalhe = document.getElementById("nomeSoldadoDetalhe");
  const modoSoldadoDetalhe = document.getElementById("modoSoldadoDetalhe");

  const mTerm = document.getElementById("searchMedicoTerm");
  const mBtn = document.getElementById("buscarMedico");
  const mClear = document.getElementById("limparMedico");
  const mRes = document.getElementById("searchMedicoResults");
  const nomeMedicoDetalhe = document.getElementById("nomeMedicoDetalhe");
  const modoMedicoDetalhe = document.getElementById("modoMedicoDetalhe");

  // ============================================================
  // RENDER LIST (COM DELETE)
  function renderList(el, dados, tipo) {
    el.innerHTML = "";

    if (!dados || dados.length === 0) {
      el.innerHTML = "<li>Nenhum resultado</li>";
      return;
    }

    dados.forEach((u) => {
      const li = document.createElement("li");

      const label = document.createElement("span");
      label.textContent = `${u.nome} - ${u.modo_alternativo}`;
      li.appendChild(label);

      const btn = document.createElement("button");
      btn.className = "delete-btn";
      btn.textContent = "Deletar";

      btn.addEventListener("click", async () => {
        if (!confirm(`Deletar ${u.nome}?`)) return;

        const res = await fetch(`/${tipo}/${u.nome}`, {
          method: "DELETE"
        });

        if (!res.ok) {
          alert("Erro ao deletar");
          return;
        }

        if (tipo === "soldados") carregarSoldados();
        if (tipo === "medicos") carregarMedicos();
      });

      li.appendChild(btn);
      el.appendChild(li);
    });
  }

  // ============================================================
  async function carregarSoldados() {
    const res = await fetch("/soldados");
    const dados = await res.json();
    renderList(listaSoldados, dados, "soldados");
  }

  async function carregarMedicos() {
    const res = await fetch("/medicos");
    const dados = await res.json();
    renderList(listaMedicos, dados, "medicos");
  }

  // ============================================================
  // CADASTRAR SOLDADO
  formSoldados.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nomeSoldado").value.trim();
    const modo_alternativo = document.getElementById("modoAlternativoSoldado").value.trim();

    await fetch("/soldados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, modo_alternativo }),
    });

    formSoldados.reset();
    carregarSoldados();
  });

  // ============================================================
  // CADASTRAR MÉDICO
  formMedicos.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nomeMedico").value.trim();
    const modo_alternativo = document.getElementById("modoAlternativoMedico").value.trim();

    await fetch("/medicos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, modo_alternativo }),
    });

    formMedicos.reset();
    carregarMedicos();
  });

  // ============================================================
  // BUSCAR POR ID OU NOME
  async function buscarPorIdOuNome(entidade, termo, resultadoEl, nomeEl, modoEl) {
    const t = termo.trim();

    if (t === "") {
      const all = await fetch("/" + entidade).then(r => r.json());
      renderList(resultadoEl, all, entidade);
      nomeEl.textContent = "";
      modoEl.textContent = "";
      return;
    }

    const all = await fetch("/" + entidade).then(r => r.json());

    const filtrados = all.filter(x =>
      x.nome.toLowerCase().includes(t.toLowerCase())
    );

    renderList(resultadoEl, filtrados, entidade);

    const first = filtrados[0];
    nomeEl.textContent = first ? first.nome : "";
    modoEl.textContent = first ? first.modo_alternativo : "";
  }

  // EVENTOS DE BUSCA
  sBtn.addEventListener("click", () => {
    buscarPorIdOuNome("soldados", sTerm.value, sRes, nomeSoldadoDetalhe, modoSoldadoDetalhe);
  });

  sClear.addEventListener("click", () => {
    sTerm.value = "";
    sRes.innerHTML = "";
    nomeSoldadoDetalhe.textContent = "";
    modoSoldadoDetalhe.textContent = "";
  });

  mBtn.addEventListener("click", () => {
    buscarPorIdOuNome("medicos", mTerm.value, mRes, nomeMedicoDetalhe, modoMedicoDetalhe);
  });

  mClear.addEventListener("click", () => {
    mTerm.value = "";
    mRes.innerHTML = "";
    nomeMedicoDetalhe.textContent = "";
    modoMedicoDetalhe.textContent = "";
  });

  // ============================================================
  carregarSoldados();
  carregarMedicos();
});
