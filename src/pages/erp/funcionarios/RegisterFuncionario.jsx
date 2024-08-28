import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import "./RegisterFuncionario.css"

function CadastroFuncionario() {
      // Token e Logout
  const [userInfo, setUserInfo] = useState('');
  const [EmpresaId, setIdEmpresa] = useState('')
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [typeUser, setTypeUser] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('/api/ServerTwo/verifyToken', { withCredentials: true });
        
        if (typeof response.data.token === 'string') {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
          setIdEmpresa(decodedToken.id_user);
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

  const generateEmail = (nome) => {
    return nome.toLowerCase().replace(/\s+/g, ".") + "@venturo.com";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/ServerTwo/cadastro_funcionario', {
        Nome: nome,
        Senha: senha,
        TypeUser: typeUser,
        Email: generateEmail(nome),
        id: EmpresaId
      });

      if (response.status === 200) {
        alert('Funcionário cadastrado com sucesso!');
      }
    } catch (error) {
      setErro('Erro ao cadastrar funcionário. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="cadastro-funcionario">
      <h2>Cadastro de Funcionário</h2>

       <div className="textoCadastrarFunc">
        <h2> Cadastrar Funcionário </h2>
        </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <select
          value={typeUser}
          onChange={(e) => setTypeUser(e.target.value)}
          required
        >
          <option value="">Selecione o cargo</option>
          <option value="Socio">Sócio</option>
          <option value="Gerente">Gerente</option>
          <option value="Estoque">Estoque</option>
          <option value="Venda">Venda</option>
        </select>
        <button type="submit">Cadastrar</button>
        {erro && <p>{erro}</p>}
      </form>
    </div>
  )
}
export default CadastroFuncionario;