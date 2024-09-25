import React, { useState } from "react";
import "./planodcontas.css";
import PlanosForm from "./planos.jsx"

// Componente para cada categoria (Receitas ou Despesas)
const Categoria = ({ nome, tipos }) => {
    const [aberto, setAberto] = useState(false);

    const toggleAberto = () => {
        setAberto(!aberto);
    };

    return (
        <div className="categoria">
            <div className="categoria-titulo" onClick={toggleAberto} style={{ cursor: 'pointer' }}>
                {nome} {aberto ? '▲' : '▼'}
            </div>
            {aberto && (
                <div className="ramificacao">
                    <div className="linha-vertical" />
                    <ul className="tipos">
                        {tipos.map((tipo, index) => (
                            <li key={index} className="tipo">
                                <div className="linha-horizontal" />
                                {tipo}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Componente principal que renderiza o plano de contas
const PlanoDeContas = () => {
    const receitas = ['Venda de Produtos', 'Serviços Prestados', 'Juros Recebidos'];
    const despesas = ['Custo de Mercadorias', 'Salários', 'Despesas Operacionais'];

    return (
        <div>
            <Categoria nome="Receitas" tipos={receitas} />
            <Categoria nome="Despesas" tipos={despesas} />
        </div>
    );
};

function PlanoDContas() {
    const [abaAtiva, setAbaAtiva] = useState("Planos de Contas");

    const renderizarConteudo = () => {
        switch (abaAtiva) {
            case "Planos de Contas":
                return (
                    <div>
                              <h3>Plano de Contas</h3>
         
            <div className="DadosPlano">
                <div className="title-dados">
                    <h3>Dados</h3>
                </div>
                <div className="nome-dados">
                    <h4>Nome</h4>
                    <select className="select">
                        <option>Plano A</option>
                        <option>Plano B</option>
                    </select>
                </div>
            </div>
                        
                    <div className="items-planos">
                        <div className="planodecontas-item">
                            <div className="header-item">
                                <h4>Item do Plano de Conta</h4>
                            </div>
                            <PlanoDeContas />
                        </div>
                        <div className="edit-item">
                            <div className="header-item">
                                <h4>Adicionar Conta</h4>
                            </div>
                            <div className="form-item">
                                <label>Código Reduzido</label>
                                <input className="codigo" />
                                <label>Descrição</label>
                                <input />
                                <label>Máscara</label>
                                <input />
                                <label>Orientação</label>
                                <select>
                                    <option>Crédito</option>
                                    <option>Débito</option>
                                    <option>Ambos</option>
                                </select>
                                <label>Tipo de conta</label>
                                <div>
                                    <select>
                                        <option>Sintética</option>
                                        <option>Analítica</option>
                                    </select>
                                    <button className="button-update">Salvar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                );
            case "Planos":
                return (<PlanosForm/>);
            default:
                return null;
        }
    };

    return (
        <main className="main-container">
         <div className="header-plano">
                <button className="button-plano" onClick={() => setAbaAtiva("Planos de Contas")}>Plano de Contas</button>
                <button className="button-plano" onClick={() => setAbaAtiva("Planos")}>Cadastrar Planos</button>
            </div>
            {renderizarConteudo()}
        </main>
    );
}

export default PlanoDContas;
