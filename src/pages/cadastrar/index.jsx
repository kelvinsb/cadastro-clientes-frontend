/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import './index.css';
import { enderecoApi, endpointListagemSexo, endpointCadastroCliente } from '../../consts';

const minimoQuatro = 'Mínimo de 4 caracteres';
const minimoUm = 'Mínimo de 1 caracter';
const minimoCinco = 'Mínimo de 5 caracteres';
const minimoOito = 'Mínimo de 8 caracteres';
const maximoDoze = 'Máximo de 12 caracteres';
const maximoQuarenta = 'Máximo de 40 caracteres';
const maximoOitenta = 'Máximo de 80 caracteres';
const maximoDez = 'Máximo de 10 caracteres';
const campoObrigatorio = 'Campo obrigatório';
const deveSerNumero = 'Deve ser número';

const consultarCep = (cep) => {
    return new Promise((resolve, reject) => {
        const url = `https://viacep.com.br/ws/${cep}/json`;
        axios.get(url)
            .then(resolve)
            .catch(reject);
    });
};

const validacaoSchema = Yup.object().shape({
    nome: Yup
        .string()
        .min(4, minimoQuatro)
        .max(80, maximoOitenta)
        .trim()
        .required(campoObrigatorio),

    data_nascimento: Yup
        .date()
        .required(campoObrigatorio),

    sexo: Yup
        .string()
        .required(campoObrigatorio),

    numero: Yup
        .string()
        .min(1, minimoUm)
        .max(10, maximoDez)
        .trim(),

    complemento: Yup
        .string()
        .min(4, minimoCinco)
        .max(40, maximoQuarenta),

    cep: Yup
        .string()
        .min(8, minimoOito)
        .max(12, maximoDoze)
        .matches(/^[0-9]*$/, deveSerNumero),

});

class Cadastrar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sexos: [],
            erro: false,
            loading: true,
            redirecionar: false,
            mensagem: '',
            valoresIniciais: {
                nome: '',
                data_nascimento: '',
                sexo: '',
                cep: '',
                logradouro: '',
                complemento: '',
                numero: '',
                bairro: '',
                cidade: '',
                estado: '',
            }
        }
    }

    carregamentos = () => {
        return new Promise((resolve, reject) => {
            const promises = [];

            const {
                id: idConta = 0,
            } = this.props.match.params;
            const parametroIdConta = parseInt(idConta, 10);
            if (typeof parametroIdConta !== 'number' || isNaN(parametroIdConta)) {
                this.setState({
                    erro: true,
                })
            }
            if (parametroIdConta && parametroIdConta >= 0) {
                promises.push(this.obterDados(idConta));
            }
            promises.push(this.obterSexos());

            Promise.all(promises)
                .then(() => {
                    this.setState({
                        loading: false,
                    })
                })
        })
    }

    componentDidMount() {
        this.carregamentos();
    }

    prepararDados = (valores) => {
        const {
            nome,
            data_nascimento,
            sexo: sexo_id,
            cep,
            logradouro,
            complemento,
            numero,
            bairro,
            cidade,
            estado,
        } = valores
        return {
            nome,
            data_nascimento,
            sexo_id,
            endereco: {
                complemento,
                numero,
                endereco_cep: {
                    cep,
                    logradouro,
                    bairro,
                    cidade,
                    estado,
                },
            },
        };
    }

    redirecionar = () => {
        setTimeout(() => {
            this.setState({
                redirecionar: true,
            })
        }, 3000);
    }

    criarCliente = (dados) => {
        axios.post(`${enderecoApi}${endpointCadastroCliente}`, dados)
            .then(() => {
                this.setState({
                    mensagem: "Cliente criado com sucesso",
                })
                this.redirecionar();
            })
            .catch(() => {
                this.setState({
                    mensagem: "Houve algum erro ao criar o cliente",
                })
            });
    }
    alterarCliente = (dados, idConta) => {
        axios.put(`${enderecoApi}${endpointCadastroCliente}/${idConta}`, dados)
            .then(() => {
                this.setState({
                    mensagem: "Cliente alterado com sucesso",
                })
                this.redirecionar();
            })
            .catch(() => {
                this.setState({
                    mensagem: "Houve algum erro ao alterar o cliente",
                })
            });
    }

    handleSubmit = (valores) => {
        
        const dados = this.prepararDados(valores);
        const {
            id: idConta = 0,
        } = this.props.match.params;
        if (idConta) {
            this.alterarCliente(dados, idConta);
        } else {
            this.criarCliente(dados);
        }
    }

    obterDados = (idConta) => {
        return new Promise((resolve, reject) => {
            axios.get(`${enderecoApi}${endpointCadastroCliente}/${idConta}`)
                .then(dados => {
                    const {
                        nome,
                        data_nascimento,
                        sexo_id: sexo,
                        cep,
                        logradouro,
                        complemento,
                        numero,
                        bairro,
                        cidade,
                        estado,
                    } = dados.data.resultado[0];
                    this.setState({
                        valoresIniciais: {
                            nome,
                            data_nascimento,
                            sexo,
                            cep,
                            logradouro,
                            complemento,
                            numero,
                            bairro,
                            cidade,
                            estado,
                        }
                    })
                })
                .then(resolve)
                .catch(erro => {
                    if (erro.response.status === 404) {
                        this.setState({
                            erro: true,
                        })
                    }
                })
                .catch(reject);
        })
    }

    obterSexos = () => {
        return new Promise((resolve, reject) => {
            axios.get(enderecoApi + endpointListagemSexo)
                .then(valores => {
                    this.setState({
                        sexos: valores.data.resultado,
                    })
                })
                .then(resolve)
                .catch(reject);
        });
    }

    render() {
        const {
            sexos,
            valoresIniciais,
            erro,
            loading,
            mensagem,
            redirecionar,
        } = this.state;
        if (loading) {
            return (
                <h5 className="is-5">Carregando</h5>
            )
        }
        if (erro) {
            return (
                <article className="message is-danger">
                    <div className="message-header">
                        <p>Erro</p>
                        <button className="delete" aria-label="delete"></button>
                    </div>
                    <div className="message-body">
                        Houve algum erro, provavelmente este cliente não existe.
                    </div>
                </article>
            )
        }
        if (redirecionar) {
            return <Redirect to='/' />
        }
        return (
            <>
                { mensagem && 
                    <div className="notification is-info">
                        {mensagem}
                    </div>
                }
                <Formik
                    enableReinitialize
                    onSubmit={this.handleSubmit}
                    initialValues={valoresIniciais}
                    validationSchema={validacaoSchema}
                >
                    {({
                        errors,
                        handleChange,
                        setFieldValue,
                    }) => (
                        <Form>
                            <div className="columns">
                                <div className="column is-12">
                                    <div className="field">
                                        <label className="label">Nome</label>
                                        <div
                                            className="control"
                                        >
                                            <Field
                                                name="nome"
                                                type="text"
                                                className={`input ${errors.nome ? 'is-danger' : ''}`}
                                                placeholder="Nome completo"
                                            />
                                        </div>
                                    </div>
                                    <ErrorMessage
                                        name="nome"
                                        component="div"
                                        className="notification is-danger is-light"
                                    />
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column is-6">
                                    <div className="field">
                                        <label className="label">Data de nascimento</label>
                                        <div
                                            className="control"
                                        >
                                            <Field
                                                name="data_nascimento"
                                                type="date"
                                                className={`input ${errors.data_nascimento ? 'is-danger' : ''}`}
                                                placeholder="Data de nascimento"
                                            />
                                        </div>
                                    </div>
                                    <ErrorMessage
                                        name="data_nascimento"
                                        component="div"
                                        className="notification is-danger is-light"
                                    />
                                </div>
                                <div className="column is-6">
                                    <div className="field">
                                        <label className="label">Sexo</label>
                                        <div
                                            className="control"
                                        >
                                            <Field
                                                name="sexo"
                                                as="select"
                                                className={`select ${errors.sexo ? 'is-danger' : ''}`}
                                                placeholder="Sexo"
                                            >
                                                <option
                                                    value=""
                                                >
                                                    Sexo
                                                </option>
                                                { sexos.map(elemento => (
                                                    <option
                                                        value={elemento.id}
                                                        key={elemento.id}
                                                    >
                                                        {elemento.descricao}
                                                    </option>
                                                ))}
                                            </Field>
                                        </div>
                                    </div>
                                    <ErrorMessage
                                        name="sexo"
                                        component="div"
                                        className="notification is-danger is-light"
                                    />
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column is-6">
                                    <div className="field">
                                        <label className="label">CEP</label>
                                        <div
                                            className="control"
                                        >
                                            <Field
                                                name="cep"
                                                type="text"
                                                className={`input ${errors.cep ? 'is-danger' : ''}`}
                                                placeholder="CEP"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    const valor = e.target.value;
                                                    if (valor.length >= 8) {
                                                        consultarCep(valor)
                                                            .then(valores => {
                                                                setFieldValue('logradouro', valores.data.logradouro);
                                                                setFieldValue('bairro', valores.data.bairro);
                                                                setFieldValue('cidade', valores.data.localidade);
                                                                setFieldValue('estado', valores.data.uf);
                                                            })
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <ErrorMessage
                                        name="cep"
                                        component="div"
                                        className="notification is-danger is-light"
                                    />
                                </div>
                                <div className="column is-6">
                                    <div className="field">
                                        <label className="label">Logradouro</label>
                                        <div
                                            className="control"
                                        >
                                            <Field
                                                name="logradouro"
                                                type="text"
                                                className={`input ${errors.logradouro ? 'is-danger' : ''}`}
                                                placeholder="Logradouro"
                                            />
                                        </div>
                                    </div>
                                    <ErrorMessage
                                        name="logradouro"
                                        component="div"
                                        className="notification is-danger is-light"
                                    />
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column is-6">
                                    <div className="field">
                                        <label className="label">Número</label>
                                        <div
                                            className="control"
                                        >
                                            <Field
                                                name="numero"
                                                type="text"
                                                className={`input ${errors.numero ? 'is-danger' : ''}`}
                                                placeholder="Número"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="numero"
                                            component="div"
                                            className="notification is-danger is-light"
                                        />
                                    </div>
                                </div>
                                <div className="column is-6">
                                    <div className="field">
                                        <label className="label">Complemento</label>
                                        <div
                                            className="control"
                                        >
                                            <Field
                                                name="complemento"
                                                type="text"
                                                className={`input ${errors.complemento ? 'is-danger' : ''}`}
                                                placeholder="Complemento"
                                            />
                                        </div>
                                    </div>
                                    <ErrorMessage
                                        name="complemento"
                                        component="div"
                                        className="notification is-danger is-light"
                                    />
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column is-6">
                                        <div className="field">
                                            <label className="label">Bairro</label>
                                            <div
                                                className="control"
                                            >
                                                <Field
                                                    name="bairro"
                                                    type="text"
                                                    className={`input ${errors.bairro ? 'is-danger' : ''}`}
                                                    placeholder="Bairro"
                                                />
                                            </div>
                                        </div>
                                        <ErrorMessage
                                            name="bairro"
                                            component="div"
                                            className="notification is-danger is-light"
                                        />
                                </div>
                                <div className="column is-6">
                                    <div className="field">
                                        <label className="label">Cidade</label>
                                        <div
                                            className="control"
                                        >
                                            <Field
                                                name="cidade"
                                                type="text"
                                                className={`input ${errors.cidade ? 'is-danger' : ''}`}
                                                placeholder="Cidade"
                                            />
                                        </div>
                                    </div>
                                    <ErrorMessage
                                        name="cidade"
                                        component="div"
                                        className="notification is-danger is-light"
                                    />
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column is-6">
                                    <div className="field">
                                        <label className="label">Estado</label>
                                        <div
                                            className="control"
                                        >
                                            <Field
                                                name="estado"
                                                type="text"
                                                className={`input ${errors.estado ? 'is-danger' : ''}`}
                                                placeholder="Estado"
                                            />
                                        </div>
                                    </div>
                                    <ErrorMessage
                                        name="estado"
                                        component="div"
                                        className="notification is-danger is-light"
                                    />
                                </div>
                            </div>

                            <div className="field is-grouped">
                                <div className="control">
                                    <button className="button is-link" type="submit">
                                        Cadastrar
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>
        )
    }
}

export default Cadastrar;
