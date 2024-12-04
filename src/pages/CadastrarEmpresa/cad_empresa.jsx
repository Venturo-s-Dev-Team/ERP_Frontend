import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./cad_empresa.css";
import InputMask from "react-input-mask";

function Cad_Empresa() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("/api/ServerTwo/verifyToken", {
          withCredentials: true,
        });
        if (response.status === 200) {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else if (response.status === 201) {
          alert("Refresh necessário");
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        }
      } catch (error) {
        console.error("Token inválido", error);
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  const [formData, setFormData] = useState({
    InscricaoEstadual: "",
    Municipio: "",
    UF: "",
    Logradouro: "",
    Numero: "",
    CEP: "",
    Complemento: "",
    Telefone: "",
    Site: "",
    CPF: "",
    RG: "",
    ContratoSocial: null,
    RequerimentoEmpresario: null,
    CertificadoMEI: null,
  });

  // Busca do CEP
  const buscarCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        // Atualiza os campos com os valores retornados da API
        setFormData({
          ...formData,
          Logradouro: data.logradouro,
          Municipio: data.localidade,
          UF: data.uf,
        });

        console.log(response);
      } else {
        alert("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao buscar o CEP.");
    }
  };

  // Função para lidar com o evento de perder o foco (onBlur) no campo CEP
  const handleCepBlur = (e) => {
    const cep = e.target.value.replace(/\D/g, ""); // Remove qualquer caractere não numérico

    if (cep.length === 8) {
      // Chama a função de busca do CEP se o formato for válido
      buscarCep(cep);
      console.log(cep);
    } else {
      alert("Por favor, insira um CEP válido.");
    }
  };

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
    const id = userInfo.id_user;

    // Adiciona os campos do formulário ao FormData
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post(`/api/ServerTwo/updateEmpresa/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Exibe o alerta e verifica se o usuário clicou em "OK"
      alert("Informações atualizadas com sucesso!");
      navigate("/logout");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário.");
    }
  };

  return (
    <main>
      <div className="Container-CadEmp" onSubmit={handleSubmit}>
        <form className="BoxForms-CadEmp">
          <h2>Formulário de Empresa</h2>
          {/* Parte Geral */}
          <div className="GeralDiv-CadEmp">
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

            <label>
              Site:
              <InputMask
                type="url"
                name="Site"
                value={formData.Site}
                onChange={handleChange}
                placeholder="url:"
              />
            </label>
          </div>

          {/* Parte Endereço */}
          <div className="EndereçoDiv-CadEmp">
            <legend>Endereço</legend>
            <label>
              CEP:
              <InputMask
                mask="99999-999"
                type="text"
                name="CEP"
                value={formData.CEP}
                onChange={handleChange}
                onBlur={handleCepBlur}
                required
              />
            </label>

            <label>
              Município:
              <InputMask
                type="text"
                name="Municipio"
                value={formData.Municipio}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Uf:
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
              <InputMask
                type="text"
                name="Logradouro"
                value={formData.Logradouro}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Números:
              <InputMask
                mask="9999"
                type="text"
                name="Numero"
                value={formData.Numero}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Complemento:
              <InputMask
                type="text"
                name="Complemento"
                value={formData.Complemento}
                onChange={handleChange}
                required
              />
            </label>

          </div>

          {/* Parte Empresa */}
          <div className="EmpresaDiv-CadEmp">
            <legend>Cadastrante</legend>
            <label>
              Telefone:
              <InputMask
                mask="(99)99999-9999"
                type="text"
                name="Telefone"
                value={formData.Telefone}
                onChange={handleChange}
                required
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
          </div>

          {/* Parte Documentos  */}
          <div className="DocumentosDiv-CadEmp">
            <legend>Documentos</legend>
            <label>
              Contrato Social:
              <InputMask
                type="file"
                name="ContratoSocial"
                onChange={handleFileChange}
                required
              />
            </label>
            <label>
              Requerimento de Empresário:
              <InputMask
                type="file"
                name="RequerimentoEmpresario"
                onChange={handleFileChange}
                required
              />
            </label>
            <label>
              Certificado MEI:
              <InputMask
                type="file"
                name="CertificadoMEI"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>

          {/* Botão de Enviar  */}
          <button className="Enviar-CadEmp" type="submit">
            Enviar
          </button>
        </form>
      </div>
    </main>
  );
}

export default Cad_Empresa;