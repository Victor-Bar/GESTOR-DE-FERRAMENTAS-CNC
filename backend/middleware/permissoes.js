function apenasAdministrador(req, res, next) {

    if (!req.auth) {
        return res.status(401).json({
            erro: 'Não autenticado'
        });
    }

    if (req.auth.tipo !== 'administrador') {
        return res.status(403).json({
            erro: 'Acesso permitido apenas para administradores'
        });
    }

    next();
}


function apenasEngenheiroOuAdministrador(req, res, next) {

    if (!req.auth) {
        return res.status(401).json({
            erro: 'Não autenticado'
        });
    }

    if (
        req.auth.tipo !== 'engenheiro' &&
        req.auth.tipo !== 'administrador'
    ) {
        return res.status(403).json({
            erro: 'Acesso permitido apenas para engenheiros ou administradores'
        });
    }

    next();
}


function apenasOperadorOuEngenheiroOuAdministrador(req, res, next) {

    if (!req.auth) {
        return res.status(401).json({
            erro: 'Não autenticado'
        });
    }

    next();
}

module.exports = {
    apenasAdministrador,
    apenasEngenheiroOuAdministrador,
    apenasOperadorOuEngenheiroOuAdministrador
};