document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("wedding-form");
  const presenca = document.getElementById("presenca");
  const guestCountSection = document.getElementById("guest-count-section");
  const adultosSection = document.getElementById("adultos-section");
  const criancasSection = document.getElementById("criancas-section");
  const adultosContainer = document.getElementById("adultos-container");
  const criancasContainer = document.getElementById("criancas-container");
  const adultosInput = document.getElementById("adultos");
  const criancasInput = document.getElementById("criancas");
  const nomeInput = document.getElementById("nome");
  const sobrenomeInput = document.getElementById("sobrenome");

  const FORM_ENDPOINT = "https://script.google.com/macros/s/COLOCAR_ENDPOINT_AQUI/exec";

  function setLockedStyle(input, isLocked) {
    input.readOnly = isLocked;
    input.tabIndex = isLocked ? -1 : 0;
    input.classList.toggle("input-readonly", isLocked);
  }

  function shouldLockFirstAdult() {
    return presenca.value === "Sim" && (parseInt(adultosInput.value, 10) || 0) > 0;
  }

  function updateRequiredFieldsForGuests() {
    document.querySelectorAll("#adultos-container input, #criancas-container input").forEach(input => {
      const isRestriction = input.id.includes("restricoes");
      input.required = !isRestriction && presenca.value === "Sim";
    });
  }

  function createGuestRow(type, index) {
    const wrap = document.createElement("div");
    wrap.className = "guest-row";

    const title = type === "adulto" ? `Adulto ${index + 1}` : `Criança ${index + 1}`;

    wrap.innerHTML = `
      <div class="guest-title">${title}</div>
      <div class="form-grid-2">
        <div class="form-field">
          <label for="${type}-nome-${index}">Nome <span class="req">(obrigatório)</span></label>
          <input class="input" id="${type}-nome-${index}" type="text">
        </div>
        <div class="form-field">
          <label for="${type}-apelido-${index}">Apelido <span class="req">(obrigatório)</span></label>
          <input class="input" id="${type}-apelido-${index}" type="text">
        </div>
      </div>
      <div class="form-field">
        <label for="${type}-restricoes-${index}">Restrições alimentares</label>
        <input class="input" id="${type}-restricoes-${index}" type="text" placeholder="Opcional">
      </div>
    `;

    return wrap;
  }

  function preencherPrimeiroAdultoAutomaticamente() {
    const campoNomeAdulto = document.getElementById("adulto-nome-0");
    const campoApelidoAdulto = document.getElementById("adulto-apelido-0");

    if (!campoNomeAdulto || !campoApelidoAdulto) return;

    if (shouldLockFirstAdult()) {
      campoNomeAdulto.value = nomeInput.value.trim();
      campoApelidoAdulto.value = sobrenomeInput.value.trim();

      setLockedStyle(campoNomeAdulto, true);
      setLockedStyle(campoApelidoAdulto, true);
    } else {
      setLockedStyle(campoNomeAdulto, false);
      setLockedStyle(campoApelidoAdulto, false);
    }
  }

  function renderGuests(container, type, count) {
    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const row = createGuestRow(type, i);
      container.appendChild(row);
    }

    updateRequiredFieldsForGuests();
  }

  function refreshGuestFields() {
    const confirmacao = presenca.value;

    if (confirmacao === "Sim") {
      guestCountSection.style.display = "block";

      const adultos = Math.max(0, parseInt(adultosInput.value, 10) || 0);
      const criancas = Math.max(0, parseInt(criancasInput.value, 10) || 0);

      renderGuests(adultosContainer, "adulto", adultos);
      renderGuests(criancasContainer, "crianca", criancas);

      adultosSection.style.display = adultos > 0 ? "block" : "none";
      criancasSection.style.display = criancas > 0 ? "block" : "none";

      preencherPrimeiroAdultoAutomaticamente();
    } else {
      guestCountSection.style.display = confirmacao === "Não" ? "none" : "block";
      adultosSection.style.display = "none";
      criancasSection.style.display = "none";
      adultosContainer.innerHTML = "";
      criancasContainer.innerHTML = "";
    }
  }

  function collectGuestData(type, count) {
    const guests = [];

    for (let i = 0; i < count; i++) {
      const nome = document.getElementById(`${type}-nome-${i}`)?.value.trim() || "";
      const apelido = document.getElementById(`${type}-apelido-${i}`)?.value.trim() || "";
      const restricoesAlimentares = document.getElementById(`${type}-restricoes-${i}`)?.value.trim() || "";

      guests.push({
        nome,
        apelido,
        restricoesAlimentares
      });
    }

    return guests;
  }

  presenca.addEventListener("change", function () {
    if (presenca.value === "Não") {
      adultosInput.value = 0;
      criancasInput.value = 0;
    } else if (presenca.value === "Sim" && !adultosInput.value) {
      adultosInput.value = 1;
    }

    refreshGuestFields();
  });

  adultosInput.addEventListener("input", function () {
    refreshGuestFields();
  });

  criancasInput.addEventListener("input", function () {
    refreshGuestFields();
  });

  nomeInput.addEventListener("input", preencherPrimeiroAdultoAutomaticamente);
  sobrenomeInput.addEventListener("input", preencherPrimeiroAdultoAutomaticamente);

  refreshGuestFields();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const confirmacao = presenca.value;
    const adultos = confirmacao === "Sim" ? Math.max(0, parseInt(adultosInput.value, 10) || 0) : 0;
    const criancas = confirmacao === "Sim" ? Math.max(0, parseInt(criancasInput.value, 10) || 0) : 0;

    const data = {
      nome: document.getElementById("nome").value.trim(),
      sobrenome: document.getElementById("sobrenome").value.trim(),
      email: document.getElementById("email").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      presenca: confirmacao,
      adultos: adultos,
      criancas: criancas,
      adultosDetalhes: confirmacao === "Sim" ? collectGuestData("adulto", adultos) : [],
      criancasDetalhes: confirmacao === "Sim" ? collectGuestData("crianca", criancas) : [],
      comentarios: ""
    };

    if (FORM_ENDPOINT.includes("COLOCAR_ENDPOINT_AQUI")) {
      alert("Template em modo de demonstração: substitui o endpoint do formulário no ficheiro form.js antes de publicar.");
      console.log("Dados recolhidos do formulário:", data);
      return;
    }

    fetch(FORM_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(() => {
        alert("Resposta enviada com sucesso!");
        form.reset();
        adultosInput.value = 1;
        criancasInput.value = 0;
        refreshGuestFields();
      })
      .catch(() => {
        alert("Erro ao enviar. Tenta novamente.");
      });
  });
});
