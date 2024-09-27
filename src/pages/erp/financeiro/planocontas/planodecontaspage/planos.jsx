import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


function PlanosForm() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [planoData, setPlanoData] = useState({
        codigo_plano: "",
        descricao: "",
        mascara: "",
    });

    useEffect(() => {
        verifyToken();
      }, []);
    
      const verifyToken = async () => {
        try {
          const response = await axios.get("/api/ServerTwo/verifyToken", {
            withCredentials: true,
          });
          if (typeof response.data.token === "string") {
            const decodedToken = jwtDecode(response.data.token);
            setUserInfo(decodedToken);
          } else {
            console.error("Token não é uma string:", response.data.token);
            navigate("/");
          }
        } catch (error) {
          console.error("Token inválido", error);
          navigate("/login");
        }
      };

      
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlanoData({ ...planoData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;

        try {
            const response = await axios.post(`/api/ServerTwo/registrarPlanos/${id}`, planoData);
            alert(response.data.message);
            // Limpar os campos após o envio
            setPlanoData({
                codigo_plano: "",
                descricao: "",
                mascara: "",
                userId: "",
                userName: "",
            });
        } catch (error) {
            console.error("Erro ao registrar plano:", error);
            alert("Erro ao registrar plano.");
        }
    };

    return (
        <div className="edit-item">
            <h3>Planos</h3>
            <form onSubmit={handleSubmit}>
                <label>Código do Plano:</label>
                <input
                    name="codigo_plano"
                    value={planoData.codigo_plano}
                    onChange={handleChange}
                    required
                />
                <label>Descrição:</label>
                <input
                    name="descricao"
                    value={planoData.descricao}
                    onChange={handleChange}
                    required
                />
                <label>Máscara:</label>
                <input
                    name="mascara"
                    value={planoData.mascara}
                    onChange={handleChange}
                    required
                />
                <button className="RegisterPr" type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default PlanosForm;
