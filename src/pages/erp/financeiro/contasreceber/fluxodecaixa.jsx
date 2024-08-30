import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { Modal } from "react-bootstrap";
import axios from "axios"; 
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function FluxoCaixa() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState('');
  const [fluxos, setFluxos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Função para abrir modal
  const abrirModal = () => setShowModal(true);
  const fecharModal = () => setShowModal(false);

  // Função para verificar o token
useEffect(() => {
  const verifyToken = async () => {
    try {
      const response = await axios.get('/api/ServerTwo/verifyToken', { withCredentials: true });
      
      if (typeof response.data.token === 'string') {
        const decodedToken = jwtDecode(response.data.token);
        setUserInfo(decodedToken);
      } else {
        console.error('Token não é uma string:', response.data.token);
        navigate('/');
      }
    } catch (error) {
      console.error('Token inválido', error);
      navigate('/login');
    }
  };
  
  verifyToken();
}, [navigate]);


  // Função para carregar dados do banco de dados
  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const receitasResponse = await axios.get(`/api/ServerOne/tablereceitas/${id}`, { withCredentials: true });
        const despesasResponse = await axios.get(`/api/ServerOne/tabledespesas/${id}`, { withCredentials: true });

        // Transforme os dados recebidos em um formato adequado para a tabela
        const receitas = receitasResponse.data.map((receita) => ({
          id: receita.id,
          descricao: receita.nome,
          entrada: receita.valor,
          saida: 0,
        }));

        const despesas = despesasResponse.data.map((despesa) => ({
          id: despesa.id,
          descricao: despesa.nome,
          entrada: 0,
          saida: despesa.valor,
        }));

        // Combine receitas e despesas
        const fluxoCaixa = [...receitas, ...despesas];

        setFluxos(fluxoCaixa);
      } catch (error) {
        console.error("Erro ao carregar dados do fluxo de caixa", error);
      }
    };

     // Só buscar pagamentos se userInfo estiver definido
     if (userInfo && userInfo.id_user) {
      fetchData(userInfo.id_user);
    }
  }, [userInfo]);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Fluxo de Caixa</h3>
      </div>

      <div className="Button_Cad">
        <button className="Button-Menu" onClick={abrirModal}>
          Adicionar
          <FaPlus />
        </button>
        <button className="Button-Menu">
          Editar
          <FaPenToSquare />
        </button>
        <button className="Button-Menu">
          Excluir
          <FaTrashCan />
        </button>
      </div>

      <div className="box_fluxo">
        <div className="saldo1-box">
          <h3>Saldo inicial do dia anterior</h3>
          <h1>R$ 3.499,90</h1>
        </div>
        <div className="saldo2-box">
          <h3>Saldo disponível para o dia seguinte</h3>
          <h1>R$ 4.293,09</h1>
        </div>
      </div>

      <div className="Despesas_List">
        <table>
          <caption>Fluxo de Caixa - Diário</caption>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Entrada</th>
              <th>Saída</th>
            </tr>
          </thead>
          <tbody>
            {fluxos.map((fluxo) => (
              <tr key={fluxo.id}>
                <td>{fluxo.descricao}</td>
                <td>R$ {fluxo.entrada.toFixed(2)}</td>
                <td>R$ {fluxo.saida.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <Modal
          style={{
            position: "fixed",
            top: "50%",
            bottom: 0,
            left: "50%",
            right: 0,
            zIndex: 1000,
            width: "70%",
            height: "73%",
            borderRadius: 20,
            transform: "translate(-50%, -50%)",
            background: "white",
            boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
          }}
          show={showModal}
          onHide={fecharModal}
        >
          <div>
            <div className="DivModalDesp">
              <div className="HeaderModal">
                <h1>Registrar Fluxo de Caixa</h1>
              </div>
              <form>
                <input type="text" placeholder="Descrição" />
                <input type="number" placeholder="Entrada" />
                <input type="number" placeholder="Saída" />
                <div className="FooterButton">
                  <button className="RegisterPr">Registrar</button>
                  <button className="FecharPr" onClick={fecharModal}>
                    Fechar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
}

export default FluxoCaixa;
