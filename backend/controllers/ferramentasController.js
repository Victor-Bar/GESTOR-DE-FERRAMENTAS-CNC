const ferramentasService = require('../services/ferramentasService');
const connection = require('../database/connection');

exports.listar = (req, res) => {

    ferramentasService.listar((erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao buscar ferramentas'
            });
        }

        res.status(200).json(resultados);

    });

};

exports.alertas = (req, res) => {
    ferramentasService.buscarAlertas((erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao buscar alertas'
            });
        }

        const alertas = resultados.map(f => {

            let nivel = 'OK';

            if (f.quantidade === 0) {
                nivel = 'CRÍTICO';
            } else if (f.quantidade <= 2) {
                nivel = 'ALTO';
            } else if (f.quantidade <= 3) {
                nivel = 'BAIXO';
            }

            return {
                ...f,
                nivel_alerta: nivel
            };
        });

        res.json({
            total_alertas: alertas.length,
            ferramentas: alertas
        });

    });

};

exports.buscarPorId = (req, res) => {

    const id = req.params.id;

   ferramentasService.buscarPorId(id, (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao buscar ferramenta'
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                erro: 'Ferramenta não encontrada'
            });
        }

        res.status(200).json(resultados[0]);

    });
    };

exports.cadastrar = (req, res) => {
/*pegando*/
    const {
        tipo,
        diametro,
        comprimento,
        material,
        quantidade
    } = req.body;

    if (!tipo || !diametro || !comprimento || !material || !quantidade) {
        return res.status(400).json({
            erro: 'Preencha todos os campos'
        });
    }
//*Envia os dados para o Service, que fará a comunicação com o Model*//
    ferramentasService.cadastrar(
        tipo,
        diametro,
        comprimento,
        material,
        quantidade,
        (erro, resultado) => {

            if (erro) {
                return res.status(500).json({
                    erro: 'Erro ao inserir ferramenta'
                });
            }

            res.status(201).json({
                mensagem: 'Ferramenta cadastrada com sucesso',
                idInserido: resultado.insertId
            });

        }
    );

};
exports.atualizar = (req, res) => {

    const id = req.params.id;

    const {
        tipo,
        diametro,
        comprimento,
        material,
        quantidade
    } = req.body;

    if (!id) {
        return res.status(400).json({
            erro: 'ID obrigatório'
        });
    }

    ferramentasService.atualizar(
        tipo,
        diametro,
        comprimento,
        material,
        quantidade,
        id,
        (erro) => {

            if (erro) {
                return res.status(500).json({
                    erro: 'Erro ao atualizar ferramenta'
                });
            }

            res.json({
                mensagem: 'Ferramenta atualizada com sucesso'
            });

        }
    );

};
exports.excluir = (req, res) => {

    const id = req.params.id;

    ferramentasService.excluir(id, (erro) => {

        if (erro) {

            console.log(erro);

            return res.status(500).json({
                erro: 'Erro ao remover ferramenta'
            });
        }

        res.json({
            mensagem: 'Ferramenta removida com sucesso',
            idRemovido: id
        });

    });

};
exports.quebrar = (req, res) => {

    const id = req.params.id;
    const { quantidade } = req.body;

    if (!quantidade || quantidade <= 0) {
        return res.status(400).json({
            erro: 'Quantidade inválida'
        });
    }

    ferramentasService.buscarPorId(id, (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao buscar ferramenta'
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                erro: 'Ferramenta não encontrada'
            });
        }

        const ferramenta = resultados[0];

        if (ferramenta.quantidade < quantidade) {
            return res.status(400).json({
                erro: 'Estoque insuficiente'
            });
        }

        const novaQtd = ferramenta.quantidade - quantidade;

        ferramentasService.atualizarQuantidade(novaQtd, id, (erro2) => {

            if (erro2) {
                return res.status(500).json({
                    erro: 'Erro ao atualizar estoque'
                });
            }

            ferramentasService.registrarQuebra(id, quantidade, (erro3) => {

                if (erro3) {
                    return res.status(500).json({
                        erro: 'Erro ao registrar quebra'
                    });
                }

                return res.json({
                    mensagem: 'Ferramenta registrada como quebrada',
                    ferramenta_id: id,
                    quantidade_quebrada: quantidade,
                    estoque_atual: novaQtd
                });

            });

        });

    });

};
