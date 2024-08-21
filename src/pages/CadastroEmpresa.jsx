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
        const response = await axios.get('http://10.144.170.4:3001/verifyToken', { withCredentials: true });
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
      await axios.post(`http://10.144.170.4:3001/updateEmpresa/${id}`, data, {
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
              <label className=''>
                Logradouro:
                <input
                  type="text"
                  name="Logradouro"
                  value={formData.Logradouro}
                  onChange={handleChange}
                  required
                />
              </label>
</div>

              <label>
                Número:
                <InputMask
                  type="text"
                  name="Numero"
                  mask='9999'
                  value={formData.Numero}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                CEP:
                <InputMask
                  mask="99999-999"
                  type="text"
                  name="CEP"
                  value={formData.CEP}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Complemento:
                <input
                  type="text"
                  name="Complemento"
                  value={formData.Complemento}
                  onChange={handleChange}
                />
              </label>

</div>
            <fieldset>
              <legend>Empresa</legend>
              <label>
                Telefone:
                <InputMask
                  type="text"
                  name="Telefone"
                  mask="(99)99999-9999"
                  value={formData.Telefone}
                  onChange={handleChange}
                />
              </label>
              <label>
                Site:
                <input
                  type="url"
                  name="Site"
                  value={formData.Site}
                  onChange={handleChange}
                />
              </label>
              <label>
                CPF:
                <InputMask
                  mask="999.999.999-99"
                  type="text"
                  name="CPF"
                  value={formData.CPF}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                RG:
                <InputMask
                  mask="99.999.999-9"
                  type="text"
                  name="RG"
                  value={formData.RG}
                  onChange={handleChange}
                  required
                />
              </label>
            </fieldset>

            <fieldset>
              <legend>Documentos</legend>
              <label>
                Contrato Social:
                <input
                  type="file"
                  name="ContratoSocial"
                  onChange={handleFileChange}
                  required
                />
              </label>
              <label>
                Requerimento de Empresário:
                <input
                  type="file"
                  name="RequerimentoEmpresario"
                  onChange={handleFileChange}
                  required
                />
              </label>
              <label>
                Certificado MEI:
                <input
                  type="file"
                  name="CertificadoMEI"
                  onChange={handleFileChange}
                  required
                />
              </label>
            </fieldset>
            <button type="submit">Enviar</button>
          </form>
        </div>
  );
}

export default CadastroEmpresa;