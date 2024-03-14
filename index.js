let funcionarioLogado = null;
let cupons = [];
let valorTotal = 0;
let valorCombustivelTotal = 0;
let saldoAtual = 0;
let valorInicial = 0;
let cuponsVisiveis = false;
let fotosCupons = [];


function alternarVisibilidadeCupons() {
    cuponsVisiveis = !cuponsVisiveis; // Inverte o valor da variável
    const listaCupons = document.getElementById('listaCupons');
    if (cuponsVisiveis) {
        listaCupons.style.display = 'block'; // Exibe a lista de cupons
        document.querySelector('button[onclick="alternarVisibilidadeCupons()"]').textContent = 'Esconder Cupons'; // Altera o texto do botão
    } else {
        listaCupons.style.display = 'none'; // Oculta a lista de cupons
        document.querySelector('button[onclick="alternarVisibilidadeCupons()"]').textContent = 'Visualizar Cupons'; // Altera o texto do botão
    }
}

function limparSaldo() {
    saldoAtual = 0;
    valorInicial = 0; // Também pode ser necessário zerar o valor inicial
    atualizarSaldo(); // Atualize o saldo exibido para refletir a mudança
}


function adicionarSaldo() {
    console.log('Botão "Adicionar Saldo" clicado!');
    let validarSaldo = document.getElementById('validar-saldo').checked;

    // Verificar se a opção validarSaldo está ativada
    if (!validarSaldo) {
        alert('A opção para validar o saldo deve estar ativada para adicionar saldo.');
        return;
    }

    let valorAdicional = parseFloat(document.getElementById('saldo-inicial').value.replace(',', '.')) || 0;
    saldoAtual += valorAdicional;
    valorInicial += valorAdicional;
    // Recalcular o saldo atual levando em consideração os cupons e o valor do combustível
    saldoAtual = valorInicial - (valorTotal + valorCombustivelTotal);
    atualizarSaldo(); // Atualizar o saldo na tela após adicionar o saldo
    document.getElementById('saldo-inicial').value = ''; // Limpar o campo após adicionar o saldo
}



function removerCupom(index) {
    // Remove o cupom da lista de cupons
    let cupomRemovido = cupons.splice(index, 1)[0];

    // Reduz o valor total de acordo com o cupom removido
    if (cupomRemovido.tipoCupom === 'normal') {
        valorTotal -= cupomRemovido.valor;
    } else if (cupomRemovido.tipoCupom === 'combustivel') {
        valorCombustivelTotal -= cupomRemovido.valorCombustivel;
    }

    // Recalcula o saldo atual
    saldoAtual = valorInicial - (valorTotal + valorCombustivelTotal);

    // Atualiza a lista de cupons exibida
    atualizarListaCupons();
    // Atualiza o saldo atual exibido
    atualizarSaldo();
}

function adicionarCupom() {
    let nomeFuncionario = document.getElementById('nome').value;
    let data = document.getElementById('data').value;
    let tipoCupom = document.getElementById('tipoCupom').value;

    if (!nomeFuncionario || !data) {
        alert('Por favor, preencha todos os campos obrigatórios (Nome do Funcionário e Data).');
        return;
    }

    let tipoEmissao = '';

    if (tipoCupom === 'normal') {
        tipoEmissao = document.getElementById('tipoEmissao').value;
    }

    let valor = 0;
    let chaveCupom = '';
    let valorCombustivel = 0;
    let chaveCupomCombustivel = '';

    if (tipoCupom === 'normal') {
        valor = parseFloat(document.getElementById('valor').value.replace(',', '.')) || 0;
    } else if (tipoCupom === 'combustivel') {
        valorCombustivel = parseFloat(document.getElementById('valorCombustivel').value.replace(',', '.')) || 0;
    }

    // Verifica se pelo menos um dos valores inseridos é diferente de zero
    if (valor === 0 && valorCombustivel === 0) {
        alert('O valor do cupom ou o valor do combustível não pode ser zero.');
        return;
    }

    // Verifica se o valor do cupom é maior do que o saldo atual, se a opção validarSaldo for verdadeira
    let validarSaldo = document.getElementById('validar-saldo').checked;

    let novoSaldo = saldoAtual; // Variável para armazenar o novo saldo após a adição do cupom

    if (validarSaldo) {
        novoSaldo -= valor; // Deduz o valor do cupom do novo saldo
        novoSaldo -= valorCombustivel; // Deduz o valor do combustível do novo saldo
        if (novoSaldo < 0) {
            alert('O valor do cupom não pode ser maior do que o saldo atual.');
            return;
        }
    }

    cupons.push({ nomeFuncionario, data, tipoCupom, tipoEmissao, valor, valorCombustivel, });

    valorTotal += valor;
    valorCombustivelTotal += valorCombustivel;

    if (tipoCupom !== 'combustivel') {
        saldoAtual = novoSaldo; // Atualiza o saldo apenas se o cupom não for de combustível
    }

    document.getElementById('valor').value = '';
    document.getElementById('valorCombustivel').value = '';

    atualizarListaCupons();
    atualizarSaldo();

    const inputElement = document.getElementById("fotoCupom");
    const files = inputElement.files;
    for (let i = 0; i < files.length; i++) {
        fotosCupons.push(files[i]);
    }
    inputElement.value = null;    
    // Limpa o campo de arquivo para permitir a seleção do mesmo arquivo novamente
}



function atualizarListaCupons() {
    let listaCupons = document.getElementById('listaCupons');
    listaCupons.innerHTML = '';

    cupons.forEach(cupom => {
        let li = document.createElement('li');
        li.innerHTML = `
            <div><strong>Data:</strong> ${cupom.data}</div>
            <div><strong>Valor:</strong> R$ ${cupom.valor.toFixed(2)}</div>
            ${cupom.valorCombustivel ? `<div><strong>Valor do Combustível:</strong> R$ ${cupom.valorCombustivel.toFixed(2)}</div>` : ''}
            <button onclick="removerCupom(${cupons.indexOf(cupom)})">Remover</button>
        `;
        listaCupons.appendChild(li);
    });
}

function atualizarSaldo() {
    document.getElementById('saldo-atual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
}

function gerarRelatorio(tipo) {
    // Verifica se há cupons registrados
    if (cupons.length === 0) {
        alert('Não há cupons registrados para gerar o relatório.');
        return;
    }

    // Captura o nome do funcionário
    const nomeFuncionarioInput = document.getElementById('nome');
    funcionarioLogado = nomeFuncionarioInput.value;

    if (!funcionarioLogado) {
        alert('Por favor, insira o nome do funcionário antes de gerar o relatório.');
        return;
    }

    const relatorioContainer = document.getElementById('relatorio-container');
    relatorioContainer.innerHTML = '';

    const titulo = document.createElement('h2');
    titulo.textContent = tipo === 'detalhado' ? 'Relatório Detalhado de Cupons' : 'Relatório Resumido';
    relatorioContainer.appendChild(titulo);

    const funcionario = document.createElement('p');
    funcionario.textContent = `Funcionário: ${funcionarioLogado}`;
    relatorioContainer.appendChild(funcionario);

    if (document.getElementById('validar-saldo').checked) {
        // Calcular saldo inicial (antes de aplicar descontos dos cupons)
        const saldoInicial = valorInicial.toFixed(2);

        const saldoInicialElement = document.createElement('p');
        saldoInicialElement.textContent = `Saldo Inicial: R$ ${saldoInicial}`;
        relatorioContainer.appendChild(saldoInicialElement);
    }

    if (tipo === 'detalhado') {
        const listaCupons = document.createElement('ul');
        cupons.forEach(cupom => {
            const cupomItem = document.createElement('li');
            cupomItem.innerHTML = `
                <div><strong>Data:</strong> ${cupom.data}</div>
                <div><strong>Valor:</strong> R$ ${cupom.valor.toFixed(2)}</div>
                ${cupom.valorCombustivel ? `<div><strong>Valor do Combustível:</strong> R$ ${cupom.valorCombustivel.toFixed(2)}</div>` : ''}
            `;
            listaCupons.appendChild(cupomItem);
            listaCupons.appendChild(document.createElement('br')); // Adiciona um espaço entre os cupons
        });
        relatorioContainer.appendChild(listaCupons);
    }

    const totalCupons = document.createElement('p');
    const totalCuponsValor = cupons.reduce((total, cupom) => total + cupom.valor + (cupom.valorCombustivel ? cupom.valorCombustivel : 0), 0);
    totalCupons.textContent = `Total dos Cupons: R$ ${totalCuponsValor.toFixed(2)}`;
    relatorioContainer.appendChild(totalCupons);

    if (tipo === 'detalhado') {
        const totalCombustivel = document.createElement('p');
        const totalCombustivelValor = cupons.reduce((total, cupom) => cupom.valorCombustivel ? total + cupom.valorCombustivel : total, 0);
        totalCombustivel.textContent = `Total de Combustível: R$ ${totalCombustivelValor.toFixed(2)}`;
        relatorioContainer.appendChild(totalCombustivel);
    } else if (tipo === 'resumido') {
        const totalCombustivel = document.createElement('p');
        const totalCombustivelValor = cupons.reduce((total, cupom) => cupom.valorCombustivel ? total + cupom.valorCombustivel : total, 0);
        totalCombustivel.textContent = `Total de Combustível (Convênio): R$ ${totalCombustivelValor.toFixed(2)}`;
        relatorioContainer.appendChild(totalCombustivel);
    }

    if (document.getElementById('validar-saldo').checked) {
        // Calcular saldo final (após aplicar descontos dos cupons)
        const saldoFinal = saldoAtual.toFixed(2);

        const saldoFinalElement = document.createElement('p');
        saldoFinalElement.textContent = `Saldo Final: R$ ${saldoFinal}`;
        relatorioContainer.appendChild(saldoFinalElement);
    }

    const imprimirBotao = document.createElement('button');
    imprimirBotao.textContent = 'Imprimir Relatório';
    imprimirBotao.className = 'imprimir-botao';
    imprimirBotao.onclick = function () {
        const relatorioWindow = window.open('', '_blank');
        relatorioWindow.document.write('<html><head><title>Relatório de Cupons</title>');
        relatorioWindow.document.write('<style>');
        relatorioWindow.document.write('.relatorio-container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #000; border-radius: 10px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }');
        relatorioWindow.document.write('h2 { text-align: center; color: #333; }');
        relatorioWindow.document.write('p { margin: 10px 0; }');
        relatorioWindow.document.write('ul { list-style-type: none; padding-left: 0; }');
        relatorioWindow.document.write('li { margin-bottom: 10px; }');
        relatorioWindow.document.write('strong { font-weight: bold; color: #555; }');
        relatorioWindow.document.write('@media print { .imprimir-botao { display: none; } }'); // Oculta o botão de impressão ao imprimir
        relatorioWindow.document.write('</style>');
        relatorioWindow.document.write('</head><body>');
        relatorioWindow.document.write('<div class="relatorio-container">');
        relatorioWindow.document.write(relatorioContainer.innerHTML);
        relatorioWindow.document.write('</div>');
        relatorioWindow.document.write('</body></html>');
        relatorioWindow.print();
    };
    relatorioContainer.appendChild(imprimirBotao);
}

function mostrarCampos() {
    let tipoCupom = document.getElementById('tipoCupom').value;
    let camposCupomNormal = document.getElementById('camposCupomNormal');
    let camposCombustivelConvenio = document.getElementById('camposCombustivelConvenio');
    let camposSaldo = document.getElementById('camposSaldo');

    if (tipoCupom === 'normal') {
        camposCupomNormal.style.display = 'block';
        camposCombustivelConvenio.style.display = 'none';
    } else if (tipoCupom === 'combustivel') {
        camposCupomNormal.style.display = 'none';
        camposCombustivelConvenio.style.display = 'block';
    }

    // Exibir campos de saldo apenas se a opção validarSaldo estiver ativada
    let validarSaldo = document.getElementById('validar-saldo').checked;
    camposSaldo.style.display = validarSaldo ? 'block' : 'none';

    if (!validarSaldo) {
        camposSaldo.style.display = 'none';
        document.getElementById('saldo-atual-container').style.display = 'none'; // Oculta o elemento saldo-atual-container
        limparSaldo();
    } else {
        camposSaldo.style.display = 'block';
        document.getElementById('saldo-atual-container').style.display = 'block'; // Exibe o elemento saldo-atual-container
    }
}

function prepararExportacaoPDF() {
    funcionarioLogado = document.getElementById('nome').value;
    if (funcionarioLogado) {
        gerarPDF();
    } else {
        alert('Por favor, insira o nome do funcionário antes de exportar para PDF.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Verifica se há um parâmetro 'action' na URL
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');

    // Se o parâmetro 'action' for 'funcao', chama a função correspondente
    if (action === 'funcao') {
        minhaFuncao(); // Chame a função desejada aqui
    }
});

function minhaFuncao() {
    // Faça algo útil aqui
    console.log('Função chamada após o redirecionamento.');
}

function limparRelatorio() {
    const relatorioContainer = document.getElementById('relatorio-container');
    relatorioContainer.innerHTML = '';
}

function limparCupons() {
    cupons = [];
    valorTotal = 0;
    valorCombustivelTotal = 0;
    atualizarListaCupons(); // Limpa a lista de cupons exibida
    atualizarSaldo(); // Atualiza o saldo exibido
}



function baixarFotosCupons() {
    if (fotosCupons.length === 0) {
        alert("Nenhuma foto de cupom para baixar.");
        return;
    }

    const zip = new JSZip();
    const folder = zip.folder("cupons");

    fotosCupons.forEach((foto, index) => {
        const fileName = `cupom_${index + 1}.${foto.name.split('.').pop()}`;
        folder.file(fileName, foto);
    });

    zip.generateAsync({ type: "blob" })
        .then(content => {
            // Cria um objeto URL para o conteúdo do arquivo ZIP
            const zipUrl = window.URL.createObjectURL(content);

            // Cria um link para fazer o download do arquivo ZIP
            const link = document.createElement("a");
            link.href = zipUrl;
            link.download = "cupons.zip";

            // Adiciona o link ao corpo do documento
            document.body.appendChild(link);

            // Simula um clique no link para iniciar o download
            link.click();

            // Remove o link do corpo do documento após o download
            document.body.removeChild(link);

            // Revoga o objeto URL para liberar a memória
            window.URL.revokeObjectURL(zipUrl);
        })
        .catch(error => {
            console.error("Erro ao gerar arquivo zip:", error);
        });
}

function visualizarImagensCupons() {
    const modal = document.getElementById('visualizacaoImagem');
    const button = document.getElementById('visualizarImg'); // Obter o botão

    // Limpa o conteúdo do modal
    modal.innerHTML = '';

    // Verifica se há imagens na variável fotosCupons
    if (fotosCupons.length === 0) {
        alert("Nenhuma foto de cupom para visualizar.");
        return;
    }

    // Iterar sobre as fotos e os cupons separadamente
    for (let i = 0; i < fotosCupons.length; i++) {
        // Verifica se há um cupom correspondente para a foto atual
        if (cupons[i]) {
            // Cria um contêiner para exibir as informações do cupom e da foto
            const container = document.createElement('div');
            container.classList.add('cupom-container'); // Adiciona uma classe para estilização opcional
        
            // Obtém o valor do cupom correspondente ao índice
            let valorCupom;
            if (cupons[i].tipoCupom === 'combustivel') {
                valorCupom = cupons[i].valorCombustivel.toFixed(2); // Usar o valor de combustível
            } else {
                valorCupom = cupons[i].valor.toFixed(2);
            }
        
            // Cria um elemento <p> para exibir o nome do cupom com o valor
            const cupomInfo = document.createElement('p');
            cupomInfo.textContent = `Cupom - R$ ${valorCupom}`; // Define o texto do índice e nome do cupom
            cupomInfo.className = 'cupom-info'; // Adiciona uma classe para estilização opcional
            container.appendChild(cupomInfo); // Adiciona o índice e o nome do cupom ao contêiner
        
            // Cria um botão para baixar e visualizar a imagem do cupom
            const botaoDownload = document.createElement('button');
            botaoDownload.textContent = 'Baixar/Visualizar'; // Texto do botão
            botaoDownload.className = 'botao-download'; // Classe para estilização opcional
            // Adiciona um evento de clique ao botão
            botaoDownload.onclick = function() {
                baixarVisualizarImagem(i);
            };
            container.appendChild(botaoDownload); // Adiciona o botão ao contêiner
        
            // Cria um botão para remover a imagem do cupom
            const botaoRemover = document.createElement('button');
            botaoRemover.textContent = 'Remover'; // Texto do botão
            botaoRemover.className = 'botao-remover'; // Classe para estilização opcional
            // Adiciona um evento de clique ao botão
            botaoRemover.onclick = function() {
                removerImagemCupom(i);
                button.textContent = 'Visualizar Imagens'; // Altera o texto do botão após a remoção
            };
            container.appendChild(botaoRemover);
            // Adiciona o botão ao contêiner
        
            // Adiciona o contêiner ao modal
            modal.appendChild(container);
        } else {
            // Se não houver um cupom correspondente, exibir uma mensagem de erro
            alert(`Não há cupom correspondente para a foto ${i + 1}.`);
            return;
        }
    }

    // Exibe o modal
    modal.style.display = 'block';
    button.textContent = 'Esconder Imagens';

    // Adiciona um evento de clique ao botão para alternar o texto e ocultar/exibir o modal
    button.addEventListener('click', function() {
        // Verifica se há imagens para visualizar
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
            button.textContent = 'Visualizar Imagens';
        } else {
            modal.style.display = 'block';
            button.textContent = 'Esconder Imagens';
        }
    });
}

function baixarVisualizarImagem(index) {
    const fotoCupom = fotosCupons[index]; // Obtém a imagem correspondente ao índice

    // Verifica se há uma imagem para o índice especificado
    if (!fotoCupom) {
        alert(`Não há imagem para o Cupom ${index + 1}.`);
        return;
    }

    // Código para baixar ou visualizar a imagem
    // Aqui você pode implementar a lógica para baixar a imagem ou abri-la em uma nova janela
    // Por exemplo, você pode usar o método window.open() para abrir a imagem em uma nova guia

    // Exemplo de abertura da imagem em uma nova guia
    const urlImagem = URL.createObjectURL(fotoCupom);
    window.open(urlImagem);
}

function removerImagemCupom(index) {
    // Remove a imagem correspondente ao índice da variável fotosCupons
    fotosCupons.splice(index, 1);

    // Atualiza a interface do usuário removendo o contêiner correspondente ao cupom removido
    const modal = document.getElementById('visualizacaoImagem');
    modal.removeChild(modal.childNodes[index]);

    // Reindexa os elementos após a remoção
    for (let i = index; i < modal.childNodes.length; i++) {
        // Atualiza o índice dos botões para corresponder à nova posição do cupom na lista
        modal.childNodes[i].childNodes[1].onclick = function() {
            baixarVisualizarImagem(i);
        };
        modal.childNodes[i].childNodes[2].onclick = function() {
            removerImagemCupom(i);
        };
    }
}

function alternarTextoBotao() {
    const botao = document.querySelector('button#botaoVisualizarImagens');
    const relatorioContainer = document.getElementById('relatorio-container');
    if (imagensCuponsVisiveis) {
        botao.textContent = 'Esconder Imagens'; // Altera o texto do botão para "Esconder Imagens"
        relatorioContainer.style.display = 'block'; // Exibe o relatório de cupom
    } else {
        botao.textContent = 'Visualizar Imagens'; // Altera o texto do botão para "Visualizar Imagens"
        relatorioContainer.style.display = 'none'; // Oculta o relatório de cupom
    }
}

function EnviarServidor() {
    // Obter os dados do formulário
    var nome = document.getElementById('nome').value;
    var data = document.getElementById('data').value;
    var tipoCupom = document.getElementById('tipoCupom').value;
    var tipoEmissao = document.getElementById('tipoEmissao').value;
    var valor = document.getElementById('valor').value;
    var valorCombustivel = document.getElementById('valorCombustivel').value;
    
    // Construir um objeto com os dados do formulário
    var dadosFormulario = {
        nome: nome,
        data: data,
        tipoCupom: tipoCupom,
        tipoEmissao: tipoEmissao,
        valor: valor,
        valorCombustivel: valorCombustivel
    };

    // Enviar os dados para o servidor
    fetch('http://localhost:8000/salvar-dados', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosFormulario)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao enviar os dados para o servidor');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados enviados com sucesso:', data);
        // Limpar o formulário após o envio bem-sucedido
        limparFormulario();
    })
    .catch(error => {
        console.error('Erro ao enviar os dados para o servidor:', error);
    });
}

function limparFormulario() {
    // Limpar os campos do formulário após o envio bem-sucedido
    document.getElementById('nome').value = '';
    document.getElementById('data').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('valorCombustivel').value = '';
}
