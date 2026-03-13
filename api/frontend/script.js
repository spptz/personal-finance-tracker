const apiUrl = 'http://localhost:8080/api/transacoes';
const mesesNome = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Função para buscar e mostrar o saldo na tela
async function carregarSaldo() {
    try {
        const resposta = await fetch(`${apiUrl}/saldo`);
        const saldo = await resposta.json();
        document.getElementById('saldoAtual').innerText = saldo.toFixed(2);
    } catch (erro) {
        console.error("Erro ao carregar saldo:", erro);
    }
}

// Função para enviar os dados do formulário para o Java
document.getElementById('formTransacao').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que a página recarregue

    // Captura os valores que você digitou na tela
    const novaTransacao = {
        descricao: document.getElementById('descricao').value,
        valor: parseFloat(document.getElementById('valor').value),
        data: document.getElementById('data').value,
        tipo: document.getElementById('tipo').value,
        categoria: document.getElementById('categoria').value
    };

    try {
        // Envia o POST para o Java (Igual fizemos no Thunder Client)
        const resposta = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaTransacao)
        });

        if (resposta.status === 201) {
            alert('Transação cadastrada com sucesso!');
            document.getElementById('formTransacao').reset(); // Limpa o formulário
            carregarTransacoes(); // Atualiza o histórico automaticamente
            carregarSaldo(); // Atualiza o saldo automaticamente
            carregarGrafico(); // Atualiza o gráfico com o filtro atual
        }
    } catch (erro) {
        alert('Erro ao conectar com o servidor.');
        console.error(erro);
    }
});

// Função para buscar as transações e montar a tabela
async function carregarTransacoes() {
    try {
        const resposta = await fetch(apiUrl); // Chama o novo GET que criamos no Java
        const transacoes = await resposta.json();
        
        const corpoTabela = document.getElementById('corpoTabela');
        corpoTabela.innerHTML = ''; // Limpa a tabela antes de preencher

        transacoes.forEach(t => {
            const tr = document.createElement('tr');
            
            // Inverte a data de YYYY-MM-DD para DD/MM/YYYY
            const dataFormatada = t.data.split('-').reverse().join('/');
            
            // Define a cor e o sinal dependendo do tipo
            const classeCor = t.tipo === 'RECEITA' ? 'receita-cor' : 'despesa-cor';
            const sinal = t.tipo === 'RECEITA' ? '+ R$' : '- R$';

            tr.innerHTML = `
                <td>${dataFormatada}</td>
                <td>${t.descricao}</td>
                <td>${t.categoria}</td>
                <td>${t.tipo}</td>
                <td class="${classeCor}">${sinal} ${t.valor.toFixed(2)}</td>
                <td><button onclick="excluirTransacao(${t.id})" class="btn-excluir">Excluir</button></td>
            `;
            corpoTabela.appendChild(tr);
        });
    } catch (erro) {
        console.error("Erro ao carregar transações:", erro);
    }
}

// Função para deletar uma transação
async function excluirTransacao(id) {
    // Pede uma confirmação para o usuário não deletar sem querer
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
        try {
            const resposta = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });

            if (resposta.status === 204) {
                alert("Transação excluída com sucesso!");
                carregarTransacoes(); // Atualiza a tabela na tela
                carregarSaldo();      // Atualiza o saldo na tela
                carregarGrafico();    // Atualiza o gráfico com o filtro atual
            }
        } catch (erro) {
            console.error("Erro ao excluir:", erro);
            alert("Erro ao excluir a transação.");
        }
    }
}

let graficoInstancia = null; // Guarda o gráfico para podermos atualizá-lo depois

function popularFiltroAno() {
    const seletorAno = document.getElementById('filtroAno');
    const anoAtual = new Date().getFullYear();

    seletorAno.innerHTML = '';

    for (let ano = anoAtual; ano >= anoAtual - 7; ano--) {
        const opcao = document.createElement('option');
        opcao.value = String(ano);
        opcao.textContent = String(ano);
        seletorAno.appendChild(opcao);
    }

    seletorAno.value = String(anoAtual);
}

function atualizarEstadoFiltroMes() {
    const periodo = document.getElementById('filtroPeriodo').value;
    const seletorMes = document.getElementById('filtroMes');
    seletorMes.disabled = periodo === 'ANUAL';
}

async function buscarRelatorioMensal(mes, ano) {
    const resposta = await fetch(`${apiUrl}/relatorio?mes=${mes}&ano=${ano}`);
    return await resposta.json();
}

async function buscarRelatorioAnual(ano) {
    const acumulado = {};

    for (let mes = 1; mes <= 12; mes++) {
        const dadosMes = await buscarRelatorioMensal(mes, ano);

        Object.entries(dadosMes).forEach(([categoria, valor]) => {
            acumulado[categoria] = (acumulado[categoria] || 0) + Number(valor);
        });
    }

    return acumulado;
}

async function carregarGrafico() {
    // Usa o filtro selecionado, ou mês/ano atual se ainda não estiver disponível
    const seletorPeriodo = document.getElementById('filtroPeriodo');
    const seletorMes = document.getElementById('filtroMes');
    const seletorAno = document.getElementById('filtroAno');

    const dataAtual = new Date();
    const periodo = seletorPeriodo ? seletorPeriodo.value : 'MENSAL';
    const mes = seletorMes ? Number(seletorMes.value) : (dataAtual.getMonth() + 1);
    const ano = dataAtual.getFullYear();
    const anoSelecionado = seletorAno ? Number(seletorAno.value) : ano;

    try {
        const dados = periodo === 'ANUAL'
            ? await buscarRelatorioAnual(anoSelecionado)
            : await buscarRelatorioMensal(mes, anoSelecionado);

        // O Java devolve um objeto { "ALIMENTACAO": 500, "SALARIO": 3000 }
        // Precisamos separar isso em duas listas para o Chart.js
        let categorias = Object.keys(dados);
        let valores = Object.values(dados);

        if (categorias.length === 0) {
            categorias = ['Sem dados'];
            valores = [1];
        }

        const tituloGrafico = periodo === 'ANUAL'
            ? `Despesas por Categoria (${anoSelecionado})`
            : `Despesas por Categoria (${mesesNome[mes - 1]}/${anoSelecionado})`;

        const contexto = document.getElementById('meuGrafico').getContext('2d');

        // Se já existir um gráfico na tela, a gente destrói para desenhar o novo por cima
        if (graficoInstancia) {
            graficoInstancia.destroy();
        }

        // Cria o gráfico
        graficoInstancia = new Chart(contexto, {
            type: 'doughnut', // Tipo do gráfico (rosca)
            data: {
                labels: categorias,
                datasets: [{
                    label: 'Total R$',
                    data: valores,
                    backgroundColor: [
                        '#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            usePointStyle: true,
                            pointStyle: 'rect',
                            boxWidth: 10,
                            boxHeight: 10,
                            padding: 30
                        }
                    },
                    title: {
                        display: true,
                        color: '#ffffff',
                        text: tituloGrafico,
                        padding: {
                            top: 0,
                            bottom: 18
                        }
                    }
                },
                layout: {
                    padding: {
                        bottom: 10
                    }
                }
            }
        });

    } catch (erro) {
        console.error("Erro ao carregar o gráfico:", erro);
    }
}

function iniciarFiltrosGrafico() {
    const dataAtual = new Date();
    const seletorMes = document.getElementById('filtroMes');
    const seletorPeriodo = document.getElementById('filtroPeriodo');
    const seletorAno = document.getElementById('filtroAno');

    popularFiltroAno();
    seletorMes.value = String(dataAtual.getMonth() + 1);
    atualizarEstadoFiltroMes();

    seletorPeriodo.addEventListener('change', () => {
        atualizarEstadoFiltroMes();
        carregarGrafico();
    });

    seletorMes.addEventListener('change', carregarGrafico);
    seletorAno.addEventListener('change', carregarGrafico);
}

// Assim que a tela abrir, ele já busca o saldo
carregarSaldo();

// Chama a função assim que a tela abre, logo abaixo do carregarSaldo() que já estava aí
carregarTransacoes();

// Configura os filtros do gráfico
iniciarFiltrosGrafico();

// Chama a função do gráfico assim que a tela abrir, logo abaixo do carregarTransacoes() que já estava aí
carregarGrafico();