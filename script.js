// script.js
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxjLjTog3CJ4cVOBEFaj_a7dpaQL1gNpKSuyXBOfAZ5a73lvc0L0dvXm-n9iLUAxYripA/exec'; // 

// Credenciais (idealmente usar autenticação mais robusta)
const USUARIO_VALIDO = 'admin';
const SENHA_VALIDA = 'cdc2026';

function fazerLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    if(user === USUARIO_VALIDO && pass === SENHA_VALIDA) {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        carregarAgenda();
    } else {
        alert('Usuário ou senha inválidos!');
    }
}

function logout() {
    document.getElementById('loginBox').style.display = 'block';
    document.getElementById('mainContainer').style.display = 'none';
}

async function carregarAgenda() {
    const dataFiltro = document.getElementById('filtroData').value;
    
    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify({
                acao: 'listarAgenda',
                filtro: { data: dataFiltro }
            })
        });
        
        const dados = await response.json();
        exibirAgenda(dados);
    } catch(error) {
        console.error('Erro:', error);
        alert('Erro ao carregar agenda!');
    }
}

function exibirAgenda(agendamentos) {
    const container = document.getElementById('agendaContainer');
    container.style.display = 'block';
    
    let html = '<table class="agenda-table">';
    html += '<tr><th>DATA</th><th>HORA</th><th>NOME</th><th>ENDEREÇO</th><th>COLETOR</th><th>AÇÕES</th></tr>';
    
    agendamentos.forEach(item => {
        html += `<tr>
            <td>${new Date(item.data).toLocaleDateString()}</td>
            <td>${item.hora}</td>
            <td>${item.nome}</td>
            <td>${item.endereco}</td>
            <td>${item.coletor}</td>
            <td>
                <button onclick="editarAgendamento(${item.linha})">✏️</button>
                <button onclick="excluirAgendamento(${item.linha})">🗑️</button>
            </td>
        </tr>`;
    });
    
    html += '</table>';
    container.innerHTML = html;
}

function gerarRota() {
    // Chamar seu script existente via Web App
    fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ acao: 'gerarRota' })
    })
    .then(response => response.json())
    .then(data => {
        alert('Rota gerada! Verifique seu e-mail.');
    });
}

// Configurar formulário de novo agendamento
document.getElementById('agendamentoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const agendamento = {
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        nome: document.getElementById('nome').value,
        endereco: document.getElementById('endereco').value,
        coletor: document.getElementById('coletor').value,
        fontePagadora: document.getElementById('fontePagadora').value,
        pontoReferencia: document.getElementById('pontoRef').value,
        responsavel: document.getElementById('responsavel').value,
        telefone: document.getElementById('telefone').value
    };
    
    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify({
                acao: 'novoAgendamento',
                agendamento: agendamento
            })
        });
        
        const resultado = await response.json();
        if(resultado.sucesso) {
            alert('Agendamento criado!');
            carregarAgenda();
            document.getElementById('formularioContainer').style.display = 'none';
        }
    } catch(error) {
        alert('Erro ao criar agendamento!');
    }
});