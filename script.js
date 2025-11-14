/* ============================================================
   script.js — Versão mesclada e organizada (com comentários)
   Mantém: carregaDados() e carregaDecepticon() — funções antigas
   Unifica: carregamento, cadastro e busca (soldados + médicos)
   ============================================================ */

/* ------------------------
   Funções antigas (mantidas)
   - carregaDados: carrega o primeiro soldado nos elementos com ids "nome" e "modo_alternativo" (se existirem)
   - carregaDecepticon: busca um soldado por id em http://localhost:3000/soldados{id} e preenche elementos específicos (se existirem)
   Observação: essas funções são legadas — ficam separadas e são chamadas se os elementos existirem.
   ------------------------ */
async function carregaDados() {
  const url = "http://localhost:3000/soldados";
  // procura elementos com ids velhos (se existirem no HTML)
  const nomeEl = document.getElementById("nome");
  const modoEl = document.getElementById("modo_alternativo");

  if (!nomeEl && !modoEl) return; // nada a preencher

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("carregaDados: resposta vazia");
      return;
    }
    if (nomeEl) nomeEl.innerHTML = data[0].nome ?? "";
    if (modoEl) modoEl.innerHTML = data[0].modo_alternativo ?? "";
    console.log("carregaDados: ok", data[0]);
  } catch (error) {
    console.error("Erro no carregamento do banco de dados:", error);
  }
}

function carregaDecepticon() {
  // monta URL com id vindo do elemento #idDecepticon
  const idInput = document.getElementById("idDecepticon");
  if (!idInput) {
    console.warn("carregaDecepticon: elemento #idDecepticon não encontrado");
    return;
  }
  const id = idInput.value;
  if (!id) {
    alert("Informe um id no campo #idDecepticon");
    return;
  }

  const url = `http://localhost:3000/soldados${id}`; // mantive a string original conforme sua parte1
  const nomeEl = document.getElementById("nomeDecepticon");
  const modoEls = document.getElementsByClassName("modoDecepticon"); // pode ser coleção

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((decepticon) => {
      if (nomeEl) nomeEl.innerHTML = decepticon.nome ?? "";
      // se existirem elementos com classe, atualiza todos; senão tenta elemento único
      if (modoEls && modoEls.length) {
        for (let i = 0; i < modoEls.length; i++) modoEls[i].innerHTML = decepticon.modo_alternativo ?? "";
      } else {
        // fallback para id single (compatibilidade)
        const modoElSingle = document.getElementById("modoDecepticon");
        if (modoElSingle) modoElSingle.innerHTML = decepticon.modo_alternativo ?? "";
      }
      console.log("carregaDecepticon: ok", decepticon);
    })
    .catch((error) => {
      console.error("erro no carregamento do Decepticon:", error);
      alert("Erro ao carregar Decepticon (veja console).");
    });
}

/* ------------------------
   Código principal: unificado dentro de um único DOMContentLoaded
   - Unifica fetchs, renderList, handlers de submit e busca
   - Mantém compatibilidade com múltiplas versões anteriores
   ------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------
     Elementos de formulário / listas
     ------------------------ */
  const formSoldados = document.getElementById("formSoldados");
  const listaSoldados = document.getElementById("listaSoldados");

  const formMedicos = document.getElementById("formMedicos");
  const listaMedicos = document.getElementById("listaMedicos");

  // Elementos legados (parte1): 'form' e 'lista' — se existirem, mantêm compatibilidade
  const legacyForm = document.getElementById("form");
  const legacyLista = document.getElementById("lista");

  /* ------------------------
     Elementos de busca (soldado)
     ------------------------ */
  const sTerm = document.getElementById("searchSoldadoTerm");
  const sBtn = document.getElementById("buscarSoldado");
  const sClear = document.getElementById("limparSoldado");
  const sRes = document.getElementById("searchSoldadoResults");
  const nomeSoldadoDetalhe = document.getElementById("nomeSoldadoDetalhe");
  const modoSoldadoDetalhe = document.getElementById("modoSoldadoDetalhe");

  /* ------------------------
     Elementos de busca (medico)
     ------------------------ */
  const mTerm = document.getElementById("searchMedicoTerm");
  const mBtn = document.getElementById("buscarMedico");
  const mClear = document.getElementById("limparMedico");
  const mRes = document.getElementById("searchMedicoResults");
  const nomeMedicoDetalhe = document.getElementById("nomeMedicoDetalhe");
  const modoMedicoDetalhe = document.getElementById("modoMedicoDetalhe");

  /* ------------------------
     Helper: renderiza uma lista genérica no elemento dado
     ------------------------ */
  function renderList(el, dados) {
    if (!el) return;
    el.innerHTML = "";
    if (!dados || dados.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Nenhum resultado";
      el.appendChild(li);
      return;
    }
    dados.forEach((u) => {
      const li = document.createElement("li");
      // mostra id se existir
      li.textContent = `#${u.id ?? ""} ${u.nome} - ${u.modo_alternativo}`;
      el.appendChild(li);
    });
  }

  /* ------------------------
     Fetch helpers
     ------------------------ */
  async function fetchAll(entidade) {
    const res = await fetch("/" + entidade);
    if (!res.ok) throw new Error("Falha ao carregar " + entidade);
    return res.json();
  }

  /* ------------------------
     Carregar listas (soldados e medicos)
     - Essas funções são usadas tanto para listas principais quanto para buscas
     ------------------------ */
  async function carregarSoldados() {
    try {
      const dados = await fetchAll("soldados");
      // render nas duas possíveis listas (nova e legada)
      renderList(listaSoldados, dados);
      renderList(legacyLista, dados); // se legacyLista for null, renderList já ignora
    } catch (err) {
      console.error("carregarSoldados:", err);
    }
  }

  async function carregarMedicos() {
    try {
      const dados = await fetchAll("medicos");
      renderList(listaMedicos, dados);
      // Não sobrescreve legacyLista novamente (evita confusão), mas se desejar, pode adaptar
    } catch (err) {
      console.error("carregarMedicos:", err);
    }
  }

  /* ------------------------
     Cadastro via formulários
     - Soldados: usa #formSoldados e campos #nomeSoldado, #modoAlternativoSoldado
     - Médicos: usa #formMedicos e campos #nomeMedico, #modoAlternativoMedico
     - Compatibilidade: se um "legacyForm" existir (id="form"), tentamos usá-lo também
     ------------------------ */
  if (formSoldados) {
    formSoldados.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nome = document.getElementById("nomeSoldado").value.trim();
      const modo_alternativo = document.getElementById("modoAlternativoSoldado").value.trim();
      try {
        const res = await fetch("/soldados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, modo_alternativo }),
        });
        if (!res.ok) throw new Error("Erro ao cadastrar soldado");
        formSoldados.reset();
        await carregarSoldados();
      } catch (err) {
        console.error(err);
        alert("Erro ao cadastrar soldado (veja console).");
      }
    });
  }

  if (formMedicos) {
    formMedicos.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nome = document.getElementById("nomeMedico").value.trim();
      const modo_alternativo = document.getElementById("modoAlternativoMedico").value.trim();
      try {
        const res = await fetch("/medicos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, modo_alternativo }),
        });
        if (!res.ok) throw new Error("Erro ao cadastrar médico");
        formMedicos.reset();
        await carregarMedicos();
      } catch (err) {
        console.error(err);
        alert("Erro ao cadastrar médico (veja console).");
      }
    });
  }

  /* ------------------------
     Compatibilidade com formulário legado (parte1)
     - Se existir elemento id="form" e campos id="nome" / id="modo_alternativo"
     - Mantém comportamento antigo: envia para /soldados e /medicos dependendo do uso
     - Observação: esse bloco não sobrescreve os formulários novos; serve apenas se você usa o HTML antigo.
     ------------------------ */
  if (legacyForm) {
    legacyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nomeCampo = document.getElementById("nome");
      const modoCampo = document.getElementById("modo_alternativo");
      if (!nomeCampo || !modoCampo) return;

      const nome = nomeCampo.value.trim();
      const modo_alternativo = modoCampo.value.trim();

      // Para manter compatibilidade com parte1, fazemos *dois* POSTS: /soldados e /medicos
      // (isso replica o comportamento duplicado original; se preferir só um endpoint, me diga)
      try {
        await fetch("/soldados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, modo_alternativo }),
        });
        await fetch("/medicos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, modo_alternativo }),
        });
        legacyForm.reset();
        await carregarSoldados();
        await carregarMedicos();
      } catch (err) {
        console.error("legacy form submit:", err);
        alert("Erro no envio do formulário legado (ver console).");
      }
    });
  }

  /* ------------------------
     Função de busca unificada (id exato -> /entidade/:id quando id numérico)
     - Caso vazio: retorna todos
     - Caso somente números: tenta /entidade/:id
     - Caso texto: filtra por nome (busca parcial, case-insensitive)
     - Preenche uma lista de resultados + os elementos de detalhe (nome e modo)
     ------------------------ */
  async function buscarPorIdOuNome(entidade, termo, resultadoEl, detalheNomeEl, detalheModoEl) {
    try {
      const t = (termo || "").trim();
      if (t === "") {
        // vazio -> mostra todos
        const all = await fetchAll(entidade);
        renderList(resultadoEl, all);
        if (detalheNomeEl) detalheNomeEl.textContent = "";
        if (detalheModoEl) detalheModoEl.textContent = "";
        return;
      }

      if (/^\d+$/.test(t)) {
        // id numérico -> usar rota /entidade/:id
        const res = await fetch(`/${entidade}/${t}`);
        if (!res.ok) {
          renderList(resultadoEl, []);
          if (detalheNomeEl) detalheNomeEl.textContent = "";
          if (detalheModoEl) detalheModoEl.textContent = "";
          alert(`${entidade.slice(0, -1)} com id ${t} não encontrado`);
          return;
        }
        const item = await res.json();
        renderList(resultadoEl, [item]);
        if (detalheNomeEl) detalheNomeEl.textContent = item.nome || "";
        if (detalheModoEl) detalheModoEl.textContent = item.modo_alternativo || "";
        return;
      }

      // busca por nome (parcial) cliente-side
      const all = await fetchAll(entidade);
      const filtrados = all.filter((x) => (x.nome || "").toLowerCase().includes(t.toLowerCase()));
      renderList(resultadoEl, filtrados);
      const first = filtrados[0] || null;
      if (detalheNomeEl) detalheNomeEl.textContent = first ? first.nome : "";
      if (detalheModoEl) detalheModoEl.textContent = first ? first.modo_alternativo : "";

      // alerta com resultados (mantendo comportamento antigo)
      const msg = filtrados && filtrados.length
        ? filtrados.map(u => `#${u.id ?? ""} ${u.nome} - ${u.modo_alternativo}`).join("\n")
        : "Nenhum resultado";
      alert(msg);
    } catch (err) {
      console.error("buscarPorIdOuNome:", err);
      alert("Erro na busca (ver console).");
    }
  }

  /* ------------------------
     Wire search buttons (soldado e médico)
     ------------------------ */
  if (sBtn && sTerm && sRes) {
    sBtn.addEventListener("click", () =>
      buscarPorIdOuNome("soldados", sTerm.value, sRes, nomeSoldadoDetalhe, modoSoldadoDetalhe)
    );
    sClear.addEventListener("click", () => {
      sTerm.value = "";
      if (sRes) sRes.innerHTML = "";
      if (nomeSoldadoDetalhe) nomeSoldadoDetalhe.textContent = "";
      if (modoSoldadoDetalhe) modoSoldadoDetalhe.textContent = "";
    });
  }

  if (mBtn && mTerm && mRes) {
    mBtn.addEventListener("click", () =>
      buscarPorIdOuNome("medicos", mTerm.value, mRes, nomeMedicoDetalhe, modoMedicoDetalhe)
    );
    mClear.addEventListener("click", () => {
      mTerm.value = "";
      if (mRes) mRes.innerHTML = "";
      if (nomeMedicoDetalhe) nomeMedicoDetalhe.textContent = "";
      if (modoMedicoDetalhe) modoMedicoDetalhe.textContent = "";
    });
  }

  /* ------------------------
     Chamadas iniciais ao carregar a página
     - carregaDados() e carregaDecepticon() são chamadas só se os elementos legados existirem.
     ------------------------ */
  carregarSoldados();
  carregarMedicos();

  // Chamadas das funções legadas (apenas se os elementos existirem)
  // carregaDados preenche #nome e #modo_alternativo (legado)
  if (document.getElementById("nome") || document.getElementById("modo_alternativo")) {
    carregaDados();
  }

  // Se houver um campo #idDecepticon, não chamamos carregaDecepticon automaticamente,
  // pois precisa de um id informado. Mantemos a função disponível para uso via botão.
  // Se desejar chamar automaticamente com um valor padrão, posso alterar.
});

