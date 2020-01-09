/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({
    itemAtivo = 'listar',
    itemAtual = 'listar',
    setarItemAtivo = {},
    children = 'Listar clientes',
    rota = '/'
}) => {

    return (
        <Link
            to={rota}
            className={`navbar-item${itemAtivo === itemAtual ? ' is-active' : ''}`}
            onClick={() => setarItemAtivo('itemAtual')}
        >
            { children }
        </Link>
    );
};

const Header = () => {
    const [isActive, setIsActive] = React.useState(false);
    const [itemAtivo, setItemAtivo] = React.useState('listar');
    return (
        <>
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a
                        role="button"
                        tabIndex="0"
                        className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="menu-superior"
                        onClick={() => {
                            setIsActive(!isActive);
                        }}
                    >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                    </a>
                </div>
                <div
                    className={`navbar-menu ${isActive ? 'is-active' : ''}`}
                >
                    <MenuItem
                        itemAtivo={itemAtivo}
                        setarItemAtivo={setItemAtivo}
                        itemAtual="listar"
                        rota="/"
                    >
                        Listar clientes
                    </MenuItem>
                    <MenuItem
                        itemAtivo={itemAtivo}
                        setarItemAtivo={setItemAtivo}
                        itemAtual="criar"
                        rota="/criar"
                    >
                        Cadastrar cliente
                    </MenuItem>
                </div>
            </nav>
        </>
    );
};

export default Header;