const API = 'http://localhost:3000';

let token = localStorage.getItem('token');
let usuarioLogado = null;
let ferramentasCache = [];
let imagemCadastroBase64 = null;
let ferramentaSelecionadaImagem = null;

function decodificarToken(token) {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (erro) {
        return null;
    }
}

function headersAuth() {
    return {
        Authorization: `Bearer ${token}`
    };
}

function headersJsonAuth() {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    };
}

function formatarNumero(valor) {
    return Number(valor || 0).toLocaleString('pt-BR');
}

function formatarMedida(valor) {
    return Number(valor || 0).toLocaleString('pt-BR');
}

function normalizarTipo(tipo) {
    return (tipo || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function ehFresaTopo(ferramenta) {
    return normalizarTipo(ferramenta.tipo).includes('topo');
}

function ehFresaEsferica(ferramenta) {
    return normalizarTipo(ferramenta.tipo).includes('esferica');
}

function obterClasseAlerta(nivel) {
    const texto = (nivel || '').toUpperCase();

    if (texto.includes('CRÍTICO') || texto.includes('CRITICO')) {
        return 'alerta-critico';
    }

    if (texto.includes('ALTO')) {
        return 'alerta-alto';
    }

    return 'alerta-baixo';
}

function formatarData(data) {
    if (!data) return 'Sem data';

    const d = new Date(data);

    if (isNaN(d.getTime())) {
        return data;
    }

    return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function obterChaveMes(data) {
    const d = new Date(data);

    if (isNaN(d.getTime())) {
        return 'Sem data';
    }

    return d.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    });
}

function atualizarTituloPagina(idTela) {
    const titulo = document.getElementById('tituloPagina');

    if (!titulo) return;

    const titulos = {
        telaDashboard: 'Dashboard',
        telaFerramentas: 'Lista de Ferramentas',
        telaCadastro: 'Cadastrar Ferramenta',
        telaEditar: 'Editar / Excluir',
        telaQuebra: 'Registrar Quebra',
        telaHistoricoQuebras: 'Histórico de Quebras',
        telaAlertas: 'Alertas',
        telaUsuarios: 'Usuários'
    };

    titulo.innerText = titulos[idTela] || 'Gestor CNC';
}

function iconeUploadFoto() {
    return `
        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M12 12V18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M9 15H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
    `;
}

function converterImagemParaBase64(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();

        leitor.onload = () => {
            resolve(leitor.result);
        };

        leitor.onerror = () => {
            reject('Erro ao ler imagem');
        };

        leitor.readAsDataURL(arquivo);
    });
}

if (token) {
    mostrarSistema();
}

async function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const resposta = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || 'Erro ao fazer login');
        }

        localStorage.setItem('token', dados.token);
        token = dados.token;

        mostrarSistema();

    } catch (erro) {
        document.getElementById('loginMsg').innerText = erro.message;
    }
}

function mostrarSistema() {
    usuarioLogado = decodificarToken(token);

    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('sistemaBox').classList.remove('hidden');

    aplicarPermissoes();

    if (usuarioLogado) {
        const info = document.getElementById('usuarioInfo');

        if (info) {
            info.innerHTML = `${usuarioLogado.nome} | ${usuarioLogado.tipo}`;
        }
    }

    mostrarTela('telaDashboard');

    carregarDashboard();
    carregarSelectFerramentas();
}

function mostrarTela(idTela) {
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
    });

    const tela = document.getElementById(idTela);

    if (tela) {
        tela.classList.add('ativa');
    }

    atualizarTituloPagina(idTela);

    if (idTela === 'telaDashboard') {
        carregarDashboard();
    }

    if (idTela === 'telaFerramentas') {
        carregarDashboard();
    }

    if (idTela === 'telaHistoricoQuebras') {
        listarHistoricoQuebras();
    }

    if (idTela === 'telaAlertas') {
        listarAlertas();
    }
}

function aplicarPermissoes() {
    if (!usuarioLogado) return;

    const tipo = usuarioLogado.tipo;

    const areaCadastro = document.getElementById('areaCadastroFerramenta');
    const areaEditarExcluir = document.getElementById('areaEditarExcluirFerramenta');
    const areaUsuarios = document.getElementById('areaUsuarios');

    const menuCadastro = document.getElementById('menuCadastro');
    const menuEditar = document.getElementById('menuEditar');
    const menuUsuarios = document.getElementById('menuUsuarios');

    if (areaCadastro) areaCadastro.classList.add('hidden');
    if (areaEditarExcluir) areaEditarExcluir.classList.add('hidden');
    if (areaUsuarios) areaUsuarios.classList.add('hidden');

    if (menuCadastro) menuCadastro.classList.add('hidden');
    if (menuEditar) menuEditar.classList.add('hidden');
    if (menuUsuarios) menuUsuarios.classList.add('hidden');

    if (tipo === 'administrador') {
        if (areaCadastro) areaCadastro.classList.remove('hidden');
        if (areaEditarExcluir) areaEditarExcluir.classList.remove('hidden');
        if (areaUsuarios) areaUsuarios.classList.remove('hidden');

        if (menuCadastro) menuCadastro.classList.remove('hidden');
        if (menuEditar) menuEditar.classList.remove('hidden');
        if (menuUsuarios) menuUsuarios.classList.remove('hidden');

        listarUsuarios();
    }

    if (tipo === 'engenheiro') {
        if (areaCadastro) areaCadastro.classList.remove('hidden');
        if (areaEditarExcluir) areaEditarExcluir.classList.remove('hidden');

        if (menuCadastro) menuCadastro.classList.remove('hidden');
        if (menuEditar) menuEditar.classList.remove('hidden');
    }
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}

/* IMAGEM NO CADASTRO */

function abrirInputImagemCadastro() {
    document.getElementById('imagemCadastroInput').click();
}

async function selecionarImagemCadastro(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    try {
        imagemCadastroBase64 = await converterImagemParaBase64(arquivo);

        document.getElementById('previewImagemCadastro').innerHTML = `
            <img src="${imagemCadastroBase64}" alt="Imagem da ferramenta">
        `;

        document.getElementById('btnRemoverImagemCadastro').classList.remove('hidden');

    } catch (erro) {
        console.log(erro);
        alert('Erro ao carregar imagem');
    }
}

function removerImagemCadastro() {
    imagemCadastroBase64 = null;

    document.getElementById('imagemCadastroInput').value = '';

    document.getElementById('previewImagemCadastro').innerHTML = iconeUploadFoto();

    document.getElementById('btnRemoverImagemCadastro').classList.add('hidden');
}

/* DASHBOARD E LISTAS */

async function carregarDashboard() {
    try {
        const resposta = await fetch(`${API}/ferramentas`, {
            headers: headersAuth()
        });

        const ferramentas = await resposta.json();

        if (!resposta.ok) {
            throw new Error(ferramentas.erro || 'Erro ao carregar ferramentas');
        }

        ferramentasCache = ferramentas;

        const topo = ferramentas.filter(ehFresaTopo);
        const esferica = ferramentas.filter(ehFresaEsferica);

        const totalTopo = topo.reduce((total, f) => total + Number(f.quantidade || 0), 0);
        const totalEsferica = esferica.reduce((total, f) => total + Number(f.quantidade || 0), 0);

        const totalTopoDashboard = document.getElementById('totalFresasTopoDashboard');
        const totalEsfericaDashboard = document.getElementById('totalFresasEsfericasDashboard');

        if (totalTopoDashboard) {
            totalTopoDashboard.innerText = formatarNumero(totalTopo);
        }

        if (totalEsfericaDashboard) {
            totalEsfericaDashboard.innerText = formatarNumero(totalEsferica);
        }

        renderizarListaFerramentas(topo, 'listaFresasTopo');
        renderizarListaFerramentas(esferica, 'listaFresasEsfericas');

        await carregarAlertasDashboard();
        await carregarQuebrasDashboard();

    } catch (erro) {
        console.log(erro);
    }
}

function renderizarListaFerramentas(ferramentas, idElemento) {
    const lista = document.getElementById(idElemento);

    if (!lista) return;

    lista.innerHTML = '';

    if (!ferramentas || ferramentas.length === 0) {
        lista.innerHTML = `<div class="item">Nenhuma ferramenta encontrada.</div>`;
        return;
    }

    ferramentas.forEach(f => {
        const fotoHtml = f.imagem_url
            ? `<img src="${f.imagem_url}" alt="${f.tipo}">`
            : iconeUploadFoto();

        lista.innerHTML += `
            <div class="item item-ferramenta">

                <div class="ferramenta-info">
                    <strong>${f.tipo}</strong><br>
                    Diâmetro: Ø${formatarMedida(f.diametro)} mm<br>
                    Comprimento: ${formatarMedida(f.comprimento)} mm<br>
                    Material: ${f.material}<br>
                    Quantidade: ${f.quantidade} un.
                </div>

                <div class="foto-area">
                    <div class="foto-visual-box">
                        ${fotoHtml}
                    </div>
                </div>

            </div>
        `;
    });
}

/* MODAL PARA EDITAR IMAGEM */

function criarModalImagemSeNaoExistir() {
    if (document.getElementById('modalImagemFerramenta')) return;

    const modal = document.createElement('div');

    modal.id = 'modalImagemFerramenta';
    modal.className = 'modal-imagem hidden';

    modal.innerHTML = `
        <div class="modal-imagem-conteudo">
            <h3>Imagem da ferramenta</h3>
            <p>Escolha uma ação para esta ferramenta.</p>

            <div class="modal-imagem-acoes">
                <button type="button" onclick="atualizarImagemSelecionada()">
                    Atualizar imagem
                </button>

                <button type="button" class="btn-danger" onclick="removerImagemSelecionada()">
                    Remover imagem
                </button>

                <button type="button" class="btn-cancelar" onclick="fecharOpcoesImagem()">
                    Cancelar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function abrirOpcoesImagem(id) {
    ferramentaSelecionadaImagem = id;

    criarModalImagemSeNaoExistir();

    const modal = document.getElementById('modalImagemFerramenta');

    modal.classList.remove('hidden');
}

function fecharOpcoesImagem() {
    const modal = document.getElementById('modalImagemFerramenta');

    if (modal) {
        modal.classList.add('hidden');
    }

    ferramentaSelecionadaImagem = null;
}

function atualizarImagemSelecionada() {
    if (!ferramentaSelecionadaImagem) return;

    const input = document.getElementById(`foto-editar-${ferramentaSelecionadaImagem}`);

    if (input) {
        input.click();
    }

    fecharOpcoesImagem();
}

async function removerImagemSelecionada() {
    if (!ferramentaSelecionadaImagem) return;

    const confirmar = confirm('Deseja remover a imagem desta ferramenta?');

    if (!confirmar) return;

    await atualizarImagemFerramenta(ferramentaSelecionadaImagem, null);

    const ferramenta = ferramentasCache.find(f => Number(f.id) === Number(ferramentaSelecionadaImagem));

    if (ferramenta) {
        ferramenta.imagem_url = null;
        renderizarPreviewImagemEditar(ferramenta);
    }

    fecharOpcoesImagem();
}

async function atualizarImagemFerramenta(id, imagem_url) {
    const ferramenta = ferramentasCache.find(f => Number(f.id) === Number(id));

    if (!ferramenta) {
        alert('Ferramenta não encontrada na lista');
        return;
    }

    const resposta = await fetch(`${API}/ferramentas/${id}`, {
        method: 'PUT',
        headers: headersJsonAuth(),
        body: JSON.stringify({
            tipo: ferramenta.tipo,
            diametro: ferramenta.diametro,
            comprimento: ferramenta.comprimento,
            material: ferramenta.material,
            quantidade: ferramenta.quantidade,
            imagem_url
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        alert(dados.erro || 'Erro ao atualizar imagem');
        return;
    }

    ferramenta.imagem_url = imagem_url;

    carregarDashboard();
    carregarSelectFerramentas();

    if (document.getElementById('previewImagemEditar')) {
        renderizarPreviewImagemEditar(ferramenta);
    }
}

async function salvarImagemFerramentaEditar(event, id) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    try {
        const imagem_url = await converterImagemParaBase64(arquivo);
        await atualizarImagemFerramenta(id, imagem_url);

        event.target.value = '';

    } catch (erro) {
        console.log(erro);
        alert('Erro ao salvar imagem');
    }
}

function renderizarPreviewImagemEditar(ferramenta) {
    const preview = document.getElementById('previewImagemEditar');

    if (!preview) return;

    const inputId = `foto-editar-${ferramenta.id}`;

    const imagemHtml = ferramenta.imagem_url
        ? `<img src="${ferramenta.imagem_url}" alt="${ferramenta.tipo}">`
        : iconeUploadFoto();

    preview.innerHTML = `
        <div>
            <button type="button" class="preview-imagem-box" onclick="abrirOpcoesImagem(${ferramenta.id})">
                ${imagemHtml}
            </button>

            <input
                id="${inputId}"
                class="input-foto-hidden"
                type="file"
                accept="image/*"
                onchange="salvarImagemFerramentaEditar(event, ${ferramenta.id})"
            >

            <div class="preview-info-editar">
                <strong>${ferramenta.tipo}</strong><br>
                Diâmetro: Ø${formatarMedida(ferramenta.diametro)} mm<br>
                Comprimento: ${formatarMedida(ferramenta.comprimento)} mm<br>
                Material: ${ferramenta.material}<br>
                Quantidade: ${ferramenta.quantidade} un.
            </div>
        </div>
    `;
}

/* ALERTAS E QUEBRAS */

async function carregarAlertasDashboard() {
    try {
        const resposta = await fetch(`${API}/ferramentas/alertas`, {
            headers: headersAuth()
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || 'Erro ao carregar alertas');
        }

        const totalAlertasDashboard = document.getElementById('totalAlertasDashboard');

        if (totalAlertasDashboard) {
            totalAlertasDashboard.innerText = dados.total_alertas || dados.ferramentas.length || 0;
        }

        renderizarAlertas(dados.ferramentas, 'dashboardAlertas', 5);

    } catch (erro) {
        console.log(erro);
    }
}

function renderizarAlertas(alertas, idElemento, limite = null) {
    const lista = document.getElementById(idElemento);

    if (!lista) return;

    lista.innerHTML = '';

    if (!alertas || alertas.length === 0) {
        lista.innerHTML = `<div class="item">Nenhum alerta de estoque no momento.</div>`;
        return;
    }

    const dados = limite ? alertas.slice(0, limite) : alertas;

    dados.forEach(f => {
        const classe = obterClasseAlerta(f.nivel_alerta);

        lista.innerHTML += `
            <div class="item ${classe}">
                <strong>${f.tipo}</strong><br>
                Diâmetro: Ø${formatarMedida(f.diametro)} mm<br>
                Comprimento: ${formatarMedida(f.comprimento)} mm<br>
                Material: ${f.material}<br>
                Quantidade: ${f.quantidade} un.<br>
                Alerta: <strong>${f.nivel_alerta}</strong>
            </div>
        `;
    });
}

async function carregarQuebrasDashboard() {
    try {
        const resposta = await fetch(`${API}/ferramentas/quebras`, {
            headers: headersAuth()
        });

        const quebras = await resposta.json();

        if (!resposta.ok) {
            throw new Error(quebras.erro || 'Erro ao carregar histórico de quebras');
        }

        const totalQuebras = quebras.reduce((total, q) => {
            return total + Number(q.quantidade || 0);
        }, 0);

        const totalQuebrasDashboard = document.getElementById('totalQuebrasDashboard');

        if (totalQuebrasDashboard) {
            totalQuebrasDashboard.innerText = formatarNumero(totalQuebras);
        }

        renderizarUltimasQuebras(quebras);

    } catch (erro) {
        console.log(erro);
    }
}

function renderizarUltimasQuebras(quebras) {
    const lista = document.getElementById('dashboardUltimasQuebras');

    if (!lista) return;

    lista.innerHTML = '';

    if (!quebras || quebras.length === 0) {
        lista.innerHTML = `<div class="item">Nenhuma quebra registrada.</div>`;
        return;
    }

    quebras.slice(0, 5).forEach(q => {
        lista.innerHTML += `
            <div class="historico-item">
                <strong>${q.tipo} Ø${formatarMedida(q.diametro)} mm</strong><br>
                Comprimento: ${formatarMedida(q.comprimento)} mm<br>
                Material: ${q.material}<br>
                Quantidade quebrada: ${q.quantidade} un.<br>
                Data: ${formatarData(q.data_quebra)}
            </div>
        `;
    });
}

async function listarFerramentas() {
    await carregarDashboard();
}

async function carregarSelectFerramentas() {
    try {
        const resposta = await fetch(`${API}/ferramentas`, {
            headers: headersAuth()
        });

        const ferramentas = await resposta.json();

        if (!resposta.ok) {
            throw new Error(ferramentas.erro || 'Erro ao carregar ferramentas');
        }

        ferramentasCache = ferramentas;

        const selectEditar = document.getElementById('idFerramentaAcao');
        const selectQuebra = document.getElementById('idQuebra');

        if (!selectEditar || !selectQuebra) return;

        selectEditar.innerHTML = `
            <option value="">Selecione uma ferramenta</option>
            <optgroup label="Fresas Topo" id="grupoTopoEditar"></optgroup>
            <optgroup label="Fresas Esféricas" id="grupoEsfericaEditar"></optgroup>
        `;

        selectQuebra.innerHTML = `
            <option value="">Selecione uma ferramenta</option>
            <optgroup label="Fresas Topo" id="grupoTopoQuebra"></optgroup>
            <optgroup label="Fresas Esféricas" id="grupoEsfericaQuebra"></optgroup>
        `;

        const grupoTopoEditar = document.getElementById('grupoTopoEditar');
        const grupoEsfericaEditar = document.getElementById('grupoEsfericaEditar');
        const grupoTopoQuebra = document.getElementById('grupoTopoQuebra');
        const grupoEsfericaQuebra = document.getElementById('grupoEsfericaQuebra');

        ferramentas.forEach(f => {
            const texto = `Ø${formatarMedida(f.diametro)} - ${f.tipo} - ${f.material} - ${f.quantidade} un.`;

            const optionEditar = document.createElement('option');
            optionEditar.value = f.id;
            optionEditar.textContent = texto;

            const optionQuebra = document.createElement('option');
            optionQuebra.value = f.id;
            optionQuebra.textContent = texto;

            if (ehFresaTopo(f)) {
                grupoTopoEditar.appendChild(optionEditar);
                grupoTopoQuebra.appendChild(optionQuebra);
            } else {
                grupoEsfericaEditar.appendChild(optionEditar);
                grupoEsfericaQuebra.appendChild(optionQuebra);
            }
        });

    } catch (erro) {
        console.log(erro);
    }
}

/* CRUD FERRAMENTAS */

async function cadastrarFerramenta() {
    const tipo = document.getElementById('tipo').value;
    const diametro = document.getElementById('diametro').value;
    const comprimento = document.getElementById('comprimento').value;
    const material = document.getElementById('material').value;
    const quantidade = document.getElementById('quantidade').value;

    const resposta = await fetch(`${API}/ferramentas`, {
        method: 'POST',
        headers: headersJsonAuth(),
        body: JSON.stringify({
            tipo,
            diametro,
            comprimento,
            material,
            quantidade,
            imagem_url: imagemCadastroBase64
        })
    });

    const dados = await resposta.json();

    alert(dados.mensagem || dados.erro);

    if (resposta.ok) {
        document.getElementById('tipo').value = '';
        document.getElementById('diametro').value = '';
        document.getElementById('comprimento').value = '';
        document.getElementById('material').value = '';
        document.getElementById('quantidade').value = '';
        removerImagemCadastro();
    }

    carregarDashboard();
    carregarSelectFerramentas();
}

async function buscarFerramentaPorId() {
    const id = document.getElementById('idFerramentaAcao').value;

    if (!id) {
        alert('Selecione uma ferramenta');
        return;
    }

    const resposta = await fetch(`${API}/ferramentas/${id}`, {
        headers: headersAuth()
    });

    const ferramenta = await resposta.json();

    if (ferramenta.erro) {
        alert(ferramenta.erro);
        return;
    }

    document.getElementById('editTipo').value = ferramenta.tipo;
    document.getElementById('editDiametro').value = Number(ferramenta.diametro);
    document.getElementById('editComprimento').value = Number(ferramenta.comprimento);
    document.getElementById('editMaterial').value = ferramenta.material;
    document.getElementById('editQuantidade').value = ferramenta.quantidade;

    const index = ferramentasCache.findIndex(f => Number(f.id) === Number(ferramenta.id));

    if (index >= 0) {
        ferramentasCache[index] = ferramenta;
    } else {
        ferramentasCache.push(ferramenta);
    }

    document.getElementById('resultadoBusca').innerHTML = `
        <div class="item">
            Ferramenta encontrada: <strong>${ferramenta.tipo}</strong>
        </div>
    `;

    renderizarPreviewImagemEditar(ferramenta);
}

async function atualizarFerramenta() {
    const id = document.getElementById('idFerramentaAcao').value;

    if (!id) {
        alert('Selecione uma ferramenta');
        return;
    }

    const tipo = document.getElementById('editTipo').value;
    const diametro = document.getElementById('editDiametro').value;
    const comprimento = document.getElementById('editComprimento').value;
    const material = document.getElementById('editMaterial').value;
    const quantidade = document.getElementById('editQuantidade').value;

    const ferramentaAtual = ferramentasCache.find(f => Number(f.id) === Number(id));
    const imagem_url = ferramentaAtual ? ferramentaAtual.imagem_url || null : null;

    const resposta = await fetch(`${API}/ferramentas/${id}`, {
        method: 'PUT',
        headers: headersJsonAuth(),
        body: JSON.stringify({
            tipo,
            diametro,
            comprimento,
            material,
            quantidade,
            imagem_url
        })
    });

    const dados = await resposta.json();

    alert(dados.mensagem || dados.erro);

    carregarDashboard();
    carregarSelectFerramentas();
}

async function excluirFerramenta() {
    const id = document.getElementById('idFerramentaAcao').value;

    if (!id) {
        alert('Selecione uma ferramenta');
        return;
    }

    const confirmar = confirm('Deseja realmente excluir esta ferramenta?');

    if (!confirmar) return;

    const resposta = await fetch(`${API}/ferramentas/${id}`, {
        method: 'DELETE',
        headers: headersAuth()
    });

    const dados = await resposta.json();

    alert(dados.mensagem || dados.erro);

    document.getElementById('previewImagemEditar').innerHTML = `
        <div class="preview-imagem-vazio">
            Selecione uma ferramenta e clique em buscar.
        </div>
    `;

    carregarDashboard();
    carregarSelectFerramentas();
}

async function registrarQuebra() {
    const id = document.getElementById('idQuebra').value;
    const quantidade = document.getElementById('qtdQuebra').value;

    if (!id) {
        alert('Selecione uma ferramenta');
        return;
    }

    if (!quantidade || Number(quantidade) <= 0) {
        alert('Informe uma quantidade válida');
        return;
    }

    const resposta = await fetch(`${API}/ferramentas/${id}/quebrar`, {
        method: 'POST',
        headers: headersJsonAuth(),
        body: JSON.stringify({ quantidade })
    });

    const dados = await resposta.json();

    alert(dados.mensagem || dados.erro);

    if (resposta.ok) {
        document.getElementById('qtdQuebra').value = '';
    }

    carregarDashboard();
    carregarSelectFerramentas();
    listarHistoricoQuebras();
}

async function listarAlertas() {
    try {
        const resposta = await fetch(`${API}/ferramentas/alertas`, {
            headers: headersAuth()
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || 'Erro ao listar alertas');
        }

        renderizarAlertas(dados.ferramentas, 'listaAlertas');

    } catch (erro) {
        console.log(erro);
    }
}

async function listarHistoricoQuebras() {
    try {
        const resposta = await fetch(`${API}/ferramentas/quebras`, {
            headers: headersAuth()
        });

        const quebras = await resposta.json();

        if (!resposta.ok) {
            throw new Error(quebras.erro || 'Erro ao listar histórico de quebras');
        }

        renderizarHistoricoQuebras(quebras);

    } catch (erro) {
        console.log(erro);
    }
}

function renderizarHistoricoQuebras(quebras) {
    const lista = document.getElementById('listaHistoricoQuebras');

    if (!lista) return;

    lista.innerHTML = '';

    if (!quebras || quebras.length === 0) {
        lista.innerHTML = `<div class="item">Nenhuma quebra registrada.</div>`;
        return;
    }

    const grupos = {};

    quebras.forEach(q => {
        const mes = obterChaveMes(q.data_quebra);

        if (!grupos[mes]) {
            grupos[mes] = [];
        }

        grupos[mes].push(q);
    });

    Object.keys(grupos).forEach(mes => {
        let html = `
            <div class="mes-historico">
                <h3>${mes}</h3>
        `;

        grupos[mes].forEach(q => {
            html += `
                <div class="historico-item">
                    <strong>${q.tipo} Ø${formatarMedida(q.diametro)} mm</strong><br>
                    Comprimento: ${formatarMedida(q.comprimento)} mm<br>
                    Material: ${q.material}<br>
                    Quantidade quebrada: ${q.quantidade} un.<br>
                    Data: ${formatarData(q.data_quebra)}
                </div>
            `;
        });

        html += `</div>`;

        lista.innerHTML += html;
    });
}

/* USUÁRIOS */

async function listarUsuarios() {
    const resposta = await fetch(`${API}/usuarios`, {
        headers: headersAuth()
    });

    const usuarios = await resposta.json();

    const lista = document.getElementById('listaUsuarios');

    if (!lista) return;

    lista.innerHTML = '';

    usuarios.forEach(usuario => {
        lista.innerHTML += `
            <div class="item">
                <strong>ID:</strong> ${usuario.id}<br>
                <strong>Nome:</strong> ${usuario.nome}<br>
                <strong>Email:</strong> ${usuario.email}<br>
                <strong>Tipo:</strong> ${usuario.tipo}<br><br>

                <button onclick="preencherUsuario(${usuario.id}, '${usuario.nome}', '${usuario.email}', '${usuario.tipo}')">
                    Editar
                </button>

                <button class="btn-danger" onclick="excluirUsuario(${usuario.id})">
                    Excluir
                </button>
            </div>
        `;
    });
}

async function cadastrarUsuario() {
    const nome = document.getElementById('usuarioNome').value;
    const email = document.getElementById('usuarioEmail').value;
    const senha = document.getElementById('usuarioSenha').value;
    const tipo = document.getElementById('usuarioTipo').value;

    const resposta = await fetch(`${API}/usuarios`, {
        method: 'POST',
        headers: headersJsonAuth(),
        body: JSON.stringify({
            nome,
            email,
            senha,
            tipo
        })
    });

    const dados = await resposta.json();

    alert(dados.mensagem || dados.erro);

    listarUsuarios();
}

function preencherUsuario(id, nome, email, tipo) {
    document.getElementById('usuarioIdEditar').value = id;
    document.getElementById('usuarioNomeEditar').value = nome;
    document.getElementById('usuarioEmailEditar').value = email;
    document.getElementById('usuarioSenhaEditar').value = '';
    document.getElementById('usuarioTipoEditar').value = tipo;
}

async function buscarUsuarioPorId() {
    const id = document.getElementById('usuarioIdEditar').value;

    if (!id) {
        alert('Informe o ID do usuário');
        return;
    }

    const resposta = await fetch(`${API}/usuarios/${id}`, {
        headers: headersAuth()
    });

    const usuario = await resposta.json();

    if (usuario.erro) {
        alert(usuario.erro);
        return;
    }

    document.getElementById('usuarioNomeEditar').value = usuario.nome;
    document.getElementById('usuarioEmailEditar').value = usuario.email;
    document.getElementById('usuarioTipoEditar').value = usuario.tipo;
}

async function atualizarUsuario() {
    const id = document.getElementById('usuarioIdEditar').value;
    const nome = document.getElementById('usuarioNomeEditar').value;
    const email = document.getElementById('usuarioEmailEditar').value;
    const senha = document.getElementById('usuarioSenhaEditar').value;
    const tipo = document.getElementById('usuarioTipoEditar').value;

    if (!id) {
        alert('Informe o ID do usuário');
        return;
    }

    const resposta = await fetch(`${API}/usuarios/${id}`, {
        method: 'PUT',
        headers: headersJsonAuth(),
        body: JSON.stringify({
            nome,
            email,
            senha,
            tipo
        })
    });

    const dados = await resposta.json();

    alert(dados.mensagem || dados.erro);

    listarUsuarios();
}

async function excluirUsuario(id) {
    const confirmar = confirm('Deseja realmente excluir este usuário?');

    if (!confirmar) return;

    const resposta = await fetch(`${API}/usuarios/${id}`, {
        method: 'DELETE',
        headers: headersAuth()
    });

    const dados = await resposta.json();

    alert(dados.mensagem || dados.erro);

    listarUsuarios();
}
