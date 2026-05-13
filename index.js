"use strict";
// ===== DADOS =====
const carrosCadastrados = {};
const vagas = {
    A1: null,
    A2: null,
    A3: null,
    A4: null,
    A5: null,
};
const estacionamento = {};
let contadorCarros = 0;
// Cadastro de carros
const nomeInput = document.getElementById("nome");
const placaInput = document.getElementById("placa");
const proprietarioInput = document.getElementById("proprietario");
const btnCadastro = document.getElementById("btnCadastro");
// Reserva/Entrada
const carroSelectInput = document.getElementById("carroSelect");
const btnEntrada = document.getElementById("btnEntrada");
// Saída
const carroSaidaSelect = document.getElementById("carroSaidaSelect");
const btnSaida = document.getElementById("btnSaida");
// ===== FUNÇÕES =====
// Cadastrar novo carro
function cadastrarCarro() {
    if (!nomeInput.value || !placaInput.value || !proprietarioInput.value) {
        alert("Preencha todos os dados!");
        return;
    }
    contadorCarros++;
    const carroId = `C${contadorCarros}`;
    carrosCadastrados[carroId] = {
        id: carroId,
        nome: nomeInput.value,
        placa: placaInput.value,
        proprietario: proprietarioInput.value,
        dataCadastro: new Date(),
    };
    alert(`Carro ${nomeInput.value} cadastrado com sucesso!`);
    nomeInput.value = "";
    placaInput.value = "";
    proprietarioInput.value = "";
    atualizarSelects();
    atualizarListaCarros();
    atualizarEstacionamento();
}
// Buscar vaga livre
function encontrarVagaLivre() {
    for (const vagaId in vagas) {
        if (vagas[vagaId] === null)
            return vagaId;
    }
    // Criar nova vaga dinamicamente
    const novaVagaId = `A${Object.keys(vagas).length + 1}`;
    vagas[novaVagaId] = null;
    return novaVagaId;
}
// Carro entra no estacionamento
function carroEntrada() {
    const carroId = carroSelectInput.value;
    if (!carroId) {
        alert("Selecione um carro!");
        return;
    }
    // Verificar se carro já está no estacionamento
    for (const reservaId in estacionamento) {
        if (estacionamento[reservaId].carroId === carroId &&
            estacionamento[reservaId].saida === null) {
            alert("Este carro já está no estacionamento!");
            return;
        }
    }
    const vagaLivre = encontrarVagaLivre();
    if (!vagaLivre) {
        alert("Nenhuma vaga disponível!");
        return;
    }
    const reservaId = `R${Object.keys(estacionamento).length + 1}`;
    estacionamento[reservaId] = {
        carroId: carroId,
        vagaId: vagaLivre,
        entrada: new Date(),
        saida: null,
    };
    vagas[vagaLivre] = carroId;
    alert(`Carro entrou na vaga ${vagaLivre}!`);
    atualizarSelects();
    atualizarEstacionamento();
}
// Carro sai do estacionamento
function carroSaida() {
    const carroId = carroSaidaSelect.value;
    if (!carroId) {
        alert("Selecione um carro!");
        return;
    }
    let encontrou = false;
    for (const reservaId in estacionamento) {
        if (estacionamento[reservaId].carroId === carroId &&
            estacionamento[reservaId].saida === null) {
            const vagaId = estacionamento[reservaId].vagaId;
            estacionamento[reservaId].saida = new Date();
            vagas[vagaId] = null;
            alert(`Carro saiu da vaga ${vagaId}!`);
            encontrou = true;
            break;
        }
    }
    if (!encontrou) {
        alert("Carro não encontrado no estacionamento!");
        return;
    }
    atualizarSelects();
    atualizarEstacionamento();
}
// Atualizar selects de carros
function atualizarSelects() {
    carroSelectInput.innerHTML =
        '<option value="">-- Selecione um carro --</option>';
    carroSaidaSelect.innerHTML =
        '<option value="">-- Selecione um carro --</option>';
    // Carros disponíveis para entrada
    for (const carroId in carrosCadastrados) {
        const carro = carrosCadastrados[carroId];
        const jaEstaEstacionado = Object.values(estacionamento).some((r) => r.carroId === carroId && r.saida === null);
        if (!jaEstaEstacionado) {
            const option = document.createElement("option");
            option.value = carroId;
            option.textContent = `${carro.nome} (${carro.placa})`;
            carroSelectInput.appendChild(option);
        }
    }
    // Carros no estacionamento para saída
    for (const reservaId in estacionamento) {
        const reserva = estacionamento[reservaId];
        if (reserva.saida === null) {
            const carro = carrosCadastrados[reserva.carroId];
            const option = document.createElement("option");
            option.value = reserva.carroId;
            option.textContent = `${carro.nome} (${carro.placa}) - Vaga ${reserva.vagaId}`;
            carroSaidaSelect.appendChild(option);
        }
    }
}
// Atualizar lista de carros cadastrados
function atualizarListaCarros() {
    const listaCarros = document.getElementById("listaCarros");
    listaCarros.innerHTML = "";
    for (const carroId in carrosCadastrados) {
        const carro = carrosCadastrados[carroId];
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerHTML = `
      <strong>${carro.nome}</strong><br>
      Placa: ${carro.placa}<br>
      Proprietário: ${carro.proprietario}
    `;
        listaCarros.appendChild(li);
    }
}
// Atualizar visualização do estacionamento
function atualizarEstacionamento() {
    const estacionamentoDiv = document.getElementById("estacionamento");
    estacionamentoDiv.innerHTML = "";
    for (const vagaId in vagas) {
        const carroId = vagas[vagaId];
        const div = document.createElement("div");
        div.className = "vaga";
        if (carroId === null) {
            div.className += " vaga-livre";
            div.textContent = `${vagaId} - Livre`;
        }
        else {
            div.className += " vaga-ocupada";
            const carro = carrosCadastrados[carroId];
            div.innerHTML = `
        <strong>${vagaId}</strong><br>
        ${carro.nome}<br>
        ${carro.placa}
      `;
        }
        estacionamentoDiv.appendChild(div);
    }
}
// ===== EVENTOS =====
btnCadastro.addEventListener("click", (e) => {
    e.preventDefault();
    cadastrarCarro();
});
btnEntrada.addEventListener("click", (e) => {
    e.preventDefault();
    carroEntrada();
});
btnSaida.addEventListener("click", (e) => {
    e.preventDefault();
    carroSaida();
});
