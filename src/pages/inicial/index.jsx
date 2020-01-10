/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Link } from 'react-router-dom';
import { enderecoApi, endpointListagemCliente, endpointCadastroCliente } from '../../consts';

const Modal = ({
    isOpen = false,
    fecharModal = () => {},
    deletar = () => {},
    nome = "",
}) => {
    return (
        <div
            className="modal"
            style={{
                display: isOpen ? 'flex' : 'none',
            }}
        >
            <div
                className="modal-background"
                onClick={fecharModal}
            />
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Deletar cliente</p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={fecharModal}
                    />
                </header>
                <section className="modal-card-body">
                    Deseja realmente excluir
                    {' '}
                    { nome }
                    {' '}
                    ?
                </section>
                <footer className="modal-card-foot">
                    <button
                        className="button is-danger"
                        onClick={() => {
                            deletar();
                            fecharModal();
                        }}
                    >
                        Excluir
                    </button>
                    <button
                        className="button is-info"
                        onClick={fecharModal}
                    >
                        Cancelar
                    </button>
                    <button
                        className="modal-close is-large"
                        aria-label="close"
                        onClick={fecharModal}
                    />
                </footer>
            </div>
        </div>
    );
};

const deletarCliente = (id, removerDaLista) => {
    axios
        .delete(`${enderecoApi}${endpointCadastroCliente}/${id}`)
        .then(() => {
            removerDaLista(id);
        });
};

const Tabela = ({
    dados = [],
}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [idCliente, setIdCliente] = useState(0);
    const [nomeCliente, setNomeCliente] = useState(0);
    const [dadosTabela, setarDadosTabela] = useState([]);

    useEffect(() => {
        setarDadosTabela(dados);
    }, [dados]);

    const removerDaLista = (id) => {
        const novaTabela = dadosTabela.filter((elemento) => elemento.id !== id);
        setarDadosTabela(novaTabela);
    };
    return (
        <>
            <Modal
                isOpen={isModalOpen}
                fecharModal={() => setModalOpen(!isModalOpen)}
                deletar={() => deletarCliente(idCliente, removerDaLista)}
                nome={nomeCliente}
            />
            <table className="table is-striped is-hoverable">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th><abbr title="Data de nascimento">Nascimento</abbr></th>
                        <th>Sexo</th>
                        <th>CEP</th>
                        <th>Endereço</th>
                        <th>Cidade</th>
                        <th>Estado</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    { dadosTabela.map((elemento) => {
                        const enderecoLista = [];
                        if (elemento.logradouro) enderecoLista.push(elemento.logradouro);
                        if (elemento.numero) enderecoLista.push(elemento.numero);
                        if (elemento.bairro) enderecoLista.push(elemento.bairro);
                        if (elemento.complemento) enderecoLista.push(elemento.complemento);
                        const endereco = enderecoLista.join(', ');
                        const dataFormatada = moment(elemento.data_nascimento).format('LL');
                        return (
                            <tr
                                key={elemento.id}
                            >
                                <th>{elemento.nome}</th>
                                <td>{dataFormatada}</td>
                                <td>{elemento.sexo}</td>
                                <td>{elemento.cep}</td>
                                <td>{endereco}</td>
                                <td>{elemento.cidade}</td>
                                <td>{elemento.estado}</td>
                                <td>
                                    <Link
                                        to={`/editar/${elemento.id}`}
                                    >
                                        <button
                                            className="button is-info is-small"
                                        >
                                            Editar
                                        </button>
                                    </Link>
                                    <br />
                                    <button
                                        className="button is-danger is-small"
                                        onClick={() => {
                                            setNomeCliente(elemento.nome);
                                            setModalOpen(!isModalOpen);
                                            setIdCliente(elemento.id);
                                        }}
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        );
                    }) }
                </tbody>
            </table>
        </>
    );
};


const Index = () => {
    const [dadosClientes, setarDadosClientes] = useState([]);

    useEffect(() => {
        async function carregarDados() {
            const resposta = await axios.get(enderecoApi + endpointListagemCliente);

            setarDadosClientes(resposta.data.resultado);
        }

        carregarDados();
    }, []);

    return (
        <>
            <h1 className="title is-3">Clientes</h1>
            <Tabela
                dados={dadosClientes}
            />
        </>
    );
};

export default Index;
