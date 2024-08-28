import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/CadastroEmpresa.css";
import { jwtDecode } from "jwt-decode";
import InputMask from 'react-input-mask';
import "../App.css";


function CadastroEmpresa() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('/api/ServerTwo/verifyToken', { withCredentials: true });
        if (response.status === 200) {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else if (response.status === 201) {
          alert('Refresh necessário');
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        }
      } catch (error) {
        console.error('Token inválido', error);
        navigate('/login');
      }
    };

    verifyToken();
  }, [navigate]);

  const [formData, setFormData] = useState({
    InscricaoEstadual: '',
    Municipio: '',
    UF: '',
    Logradouro: '',
    Numero: '',
    CEP: '',
    Complemento: '',
    Telefone: '',
    Site: '',
    CPF: '',
    RG: '',
    ContratoSocial: null,
    RequerimentoEmpresario: null,
    CertificadoMEI: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData({ ...formData, [name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const id = userInfo.id_user

    // Adiciona os campos do formulário ao FormData
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post(`/api/ServerTwo/updateEmpresa/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Exibe o alerta e verifica se o usuário clicou em "OK"
      alert('Informações atualizadas com sucesso!')
      navigate("/logout")
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao enviar formulário.');
    }
  };

  return (
      <div className='container-total-ce'>
  
          
          <form  className="box-dentro-ce"onSubmit={handleSubmit}>
          <h2>Formulário de Empresa</h2>

    <div className="geral-div">
              <legend className='legenda_cadastro-empresa'>Geral</legend>
              <div className="inscricao-div">
              <label className='inscricao'>
                Inscrição Estadual:
                <InputMask
                  mask="999.999.999.999"
                  type="text"
                  name="InscricaoEstadual"
                  value={formData.InscricaoEstadual}
                  className='input-inscricao'
                  onChange={handleChange}
                  required
                />
              </label> 
              </div> 
        </div>

<div className="endereco-div">           

              <legend  className='legenda_cadastro-empresa-especial'>Endereço</legend>
              
              <div className="municipio-div">
              <label className='municipio'>
               Município:
                <input
                  type="text"
                  name="Municipio"
                  value={formData.Municipio}
                  onChange={handleChange}
                  className="input-municipio"
                  required
                />
              </label>
              </div>

              <div className="uf-div">
              <label className='uf'>
                UF:
                <InputMask
                  mask="aa"
                  type="text"
                  name="UF"
                  value={formData.UF}
                  onChange={handleChange}
                  className='input-uf'
                  required
                />
              </label>
</div>

<div className="logradouro-div">
              <label className='logradouro'>
                Logradouro:
                <input
                  type="text"
                  name="Logradouro"
                  value={formData.Logradouro}
                  onChange={handleChange}
                  className="input-logradouro"
                  required
                />
              </label>
</div>

            <div className="numeros-div">
              <label className="numeros">
                Número:
                <InputMask
                  type="text"
                  name="Numero"
                  mask='9999'
                  value={formData.Numero}
                  onChange={handleChange}
                  className="input-numeros"
                  required
                />
              </label>
</div>

             <div className="cep-div">       
              <label>
                CEP:
                <InputMask
                  mask="99999-999"
                  type="text"
                  name="CEP"
                  value={formData.CEP}
                  onChange={handleChange}
                  className="input-cep"
                  required
                />
              </label>
</div>

<div className="complemento-div">
              <label>
                Complemento:
                <input
                  type="text"
                  name="Complemento"
                  value={formData.Complemento}
                  onChange={handleChange}
                  className="input-complemento"
                />
              </label>
</div>

</div>

<div className="empresa">
              <legend className="legenda_cadastro-empresa-especial">Empresa</legend>
             
             <div className="telefone-div">
              <label className="telefone" >
                Telefone:
                <InputMask
                  type="text"
                  name="Telefone"
                  mask="(99)99999-9999"
                  value={formData.Telefone}
                  onChange={handleChange}
                  className="input-telefone"
                />
              </label>
</div>

<div className="cpf-div">
              <label >
                CPF:
                <InputMask
                  mask="999.999.999-99"
                  type="text"
                  name="CPF"
                  value={formData.CPF}
                  onChange={handleChange}
                  className="input-cpf"
                  required
                />
              </label>
              </div>

<div className="rg-div">
              <label>
                RG:
                <InputMask
                  mask="99.999.999-9"
                  type="text"
                  name="RG"
                  value={formData.RG}
                  onChange={handleChange}
                  className="input-rg"
                  required
                />
              </label>
</div>
              
              <div className="site-div">
              <label className="site">
                Site:
                <input
                  type="url"
                  name="Site"
                  value={formData.Site}
                  onChange={handleChange}
                  className="input-site"
                />
              </label>
              </div>
              </div>

        <div className="documento-div">
              <legend className="legenda_cadastro-empresa-especial-documento">Documentos</legend>
             
             <div className="contrato-div">
              <label className="contrato">
                Contrato Social:
                <input
                  type="file"
                  name="ContratoSocial"
                  onChange={handleFileChange}
                  className="input-contrato"
                  required
                />
              </label>
</div>

<div className="requerimento-div">
              <label className="requerimento">
                Requerimento de Empresário:
                <input
                  type="file"
                  name="RequerimentoEmpresario"
                  onChange={handleFileChange}
                  className="input-requerimento"
                  required
                />
              </label>
</div>


<div className="certificado-div">
              <label className="certificado">
                Certificado MEI:
                <input
                  type="file"
                  name="CertificadoMEI"
                  onChange={handleFileChange}
                  className="input-certificado"
                  required
                />
              </label>
              </div>
           </div>

            <button className="btn-enviar-cadastro-empresa" type="submit">Enviar</button>
          </form>
        </div>
  );
}

export default CadastroEmpresa;