const API = 'http://localhost:3000';

let token = localStorage.getItem('token');
let usuarioLogado = null;

function decodificarToken(token) {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (erro) {
        return null;
    }
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
            throw new Error(dados.erro);
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
}

function mostrarTela(idTela) {
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
    });

    document.getElementById(idTela).classList.add('ativa');
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

async function carregarDashboard() {
    const resposta = await fetch(`${API}/ferramentas`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const ferramentas = await resposta.json();

    const topo = [];
    const esferica = [];
    const outras = [];

    ferramentas.forEach(f => {
        const tipo = (f.tipo || '').toLowerCase();

        if (tipo.includes('topo')) {
            topo.push(f);
        } else if (
            tipo.includes('esferica') ||
            tipo.includes('esférica')
        ) {
            esferica.push(f);
        } else {
            outras.push(f);
        }
    });

    document.getElementById('totalFerramentas').innerText = ferramentas.length;
    document.getElementById('totalTopo').innerText = topo.length;
    document.getElementById('totalEsferica').innerText = esferica.length;

    const topoDiv = document.getElementById('listaFresasTopo');
    const esfericaDiv = document.getElementById('listaFresasEsfericas');
    const outrasDiv = document.getElementById('listaOutrasFerramentas');

    topoDiv.innerHTML = '';
    esfericaDiv.innerHTML = '';
    outrasDiv.innerHTML = '';

    topo.forEach(f => {
        topoDiv.innerHTML += `
            <div class="item">
                <strong>ID:</strong> ${f.id}<br>
                <strong>${f.tipo}</strong><br>
                Material: ${f.material}<br>
                Quantidade: ${f.quantidade}
            </div>
        `;
    });

    esferica.forEach(f => {
        esfericaDiv.innerHTML += `
            <div class="item">
                <strong>ID:</strong> ${f.id}<br>
                <strong>${f.tipo}</strong><br>
                Material: ${f.material}<br>
                Quantidade: ${f.quantidade}
            </div>
        `;
    });

    outras.forEach(f => {
        outrasDiv.innerHTML += `
            <div class="item">
                <strong>ID:</strong> ${f.id}<br>
                <strong>${f.tipo}</strong><br>
                Material: ${f.material}<br>
                Quantidade: ${f.quantidade}
            </div>
        `;
    });

    carregarAlertasDashboard();
    listarFerramentas();
}

async function carregarAlertasDashboard() {
    const resposta = await fetch(`${API}/ferramentas/alertas`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const dados = await resposta.json();

    const lista = document.getElementById('dashboardAlertas');

    if (!lista) return;

    lista.innerHTML = '';

    dados.ferramentas.forEach(f => {
        lista.innerHTML += `
            <div class="item">
                <strong>${f.tipo}</strong><br>
                Quantidade: ${f.quantidade}<br>
                Alerta: ${f.nivel_alerta}
            </div>
        `;
    });
}

async function listarFerramentas() {
    const resposta = await fetch(`${API}/ferramentas`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const ferramentas = await resposta.json();

    const lista = document.getElementById('listaFerramentas');

    if (!lista) return;

    lista.innerHTML = '';

    ferramentas.forEach(f => {
        lista.innerHTML += `
            <div class="item">
                <strong>ID:</strong> ${f.id}<br>
                <strong>Tipo:</strong> ${f.tipo}<br>
                <strong>Diâmetro:</strong> ${f.diametro}<br>
                <strong>Comprimento:</strong> ${f.comprimento}<br>
                <strong>Material:</strong> ${f.material}<br>
                <strong>Quantidade:</strong> ${f.quantidade}
            </div>
        `;
    });
}

async function cadastrarFerramenta() {
    const tipo = document.getElementById('tipo').value;
    const diametro = document.getElementById('diametro').value;
    const comprimento = document.getElementById('comprimento').value;
    const material = document.getElementById('material').value;
    const quantidade = document.getElementById('quantidade').value;

    const resposta = await fetch(`${API}/ferramentas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            tipo,
            diametro,
            comprimento,
            material,
            quantidade
        })
    });

    const dados = await resposta.json();

    alert(dados.mensagem || dados.erro);

    listarFerramentas();
    carregarDashboard();
}

async function buscarFerramentaPorId() {
    const id = document.getElementById('idFerramentaAcao').value;

    if (!id) {
        alert('Informe um ID');
        return;
    }

    const resposta = await fetch(`${API}/ferramentas/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const ferramenta = await resposta.json();

    if (ferramenta.erro) {
        alert(ferramenta.erro);
        return;
    }

    document.getElementById('editTipo').value = ferramenta.tipo;
    document.getElementById('editDiametro').value = ferramenta.diametro;
    document.getElementById('editComprimento').value = ferramenta.comprimento;
    document.getElementById('editMaterial').value = ferramenta.material;
    document.getElementById('editQuantidade').value = ferramenta.quantidade;

    document.getElementById('resultadoBusca').innerHTML = `
        <p>Ferramenta encontrada: <strong>${ferramenta.tipo}</strong></p>
    `;
}

async function atualizarFerramenta() {
    const id = document.getElementById('idFerramentaAcao').value;

    const tipo = document.getElementById('editTipo').value;
    const diametro = document.getElementById('editDiametro').value;
    const comprimento = document.getElementById('editComprimento').value;
    const material = document.getElementById('editMaterial').value;
    const quantidade = document.getElementById('editQuantidade').value;

    const resposta = await fetch(`${API}/ferramentas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            tipo,
            diametro,
            comprimento,
            material,
            quantidade
        })
    });

    const dados = await resposta.json();

    alert(dados.mensagem || dados.erro);

    listarFerramentas();
    carregarDashboard();
}

async function excluirFerramenta() {
    const id = document.getElementById('idFerramentaAcao').value;

    if (!id) {
        alert('Informe um ID');
        return;
    }

    const confirmar = confirm('Deseja realmente excluir esta ferramenta?');

    if (!confirmar) return;

    const resposta = await fetch(`${API}/ferramentas/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const dados = await resposta.json();

    alert(dados.mensagem || dados.erro);

    listarFerramentas();
    carregarDashboard();
}

async function registrarQuebra() {
    const id = document.getElementById('idQuebra').value;
    const quantidade = document.getElementById('qtdQuebra').value;

    const resposta = await fetch(`${API}/ferramentas/${id}/quebrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantidade })
    });

    const dados = await resposta.json();

    alert(dados.mensagem || dados.erro);

    listarFerramentas();
    carregarDashboard();
}

async function listarAlertas() {
    const resposta = await fetch(`${API}/ferramentas/alertas`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const dados = await resposta.json();

    const lista = document.getElementById('listaAlertas');
    lista.innerHTML = '';

    dados.ferramentas.forEach(f => {
        lista.innerHTML += `
            <div class="item">
                <strong>${f.tipo}</strong><br>
                Quantidade: ${f.quantidade}<br>
                Alerta: ${f.nivel_alerta}
            </div>
        `;
    });
}

async function listarUsuarios() {
    const resposta = await fetch(`${API}/usuarios`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
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

                <button onclick="excluirUsuario(${usuario.id})">
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
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
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
        headers: {
            Authorization: `Bearer ${token}`
        }
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
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
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
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const dados = await resposta.json();

    alert(dados.mensagem || dados.erro);

    listarUsuarios();
}