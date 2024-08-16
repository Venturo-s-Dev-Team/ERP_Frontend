import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/CadastroEmpresa.css";
import { jwtDecode } from "jwt-decode";
import InputMask from 'react-input-mask';

function CadastroEmpresa() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('http://10.144.170.13:3001/verifyToken', { withCredentials: true });
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
        navigate('/');
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
      await axios.post(`http://10.144.170.13:3001/updateEmpresa/${id}`, data, {
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
    <div className='container-cadastro'>
      <div className='form-container'>
        <div className="form-sign-up">
          <h1>Formulário de Empresa</h1>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>Geral</legend>
              <label>
                Inscrição Estadual:
                <InputMask
                  mask="999.999.999.999"
                  type="text"
                  name="InscricaoEstadual"
                  value={formData.InscricaoEstadual}
                  onChange={handleChange}
                  required
                />
              </label>
            </fieldset>

            <fieldset>
              <legend>Endereço</legend>
              <label>
                Município:
                <input
                  type="text"
                  name="Municipio"
                  value={formData.Municipio}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                UF:
                <InputMask
                  mask="aa"
                  type="text"
                  name="UF"
                  value={formData.UF}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Logradouro:
                <input
                  type="text"
                  name="Logradouro"
                  value={formData.Logradouro}
                  onChange={handleChange}
                  required
                />
              </label>
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
            </fieldset>

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
                />
              </label>
              <label>
                Requerimento de Empresário:
                <input
                  type="file"
                  name="RequerimentoEmpresario"
                  onChange={handleFileChange}
                />
              </label>
              <label>
                Certificado MEI:
                <input
                  type="file"
                  name="CertificadoMEI"
                  onChange={handleFileChange}
                />
              </label>
            </fieldset>
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastroEmpresa;