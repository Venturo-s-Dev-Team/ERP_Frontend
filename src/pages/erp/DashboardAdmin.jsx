import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Venturo from "../../images/Venturo.png";

function DashboardAdmin() {
  // Inicializar o status dos itens
  const initialItems = [
    {
      id: 1,
      subtitle: "Gestão de Empresas",
      title: "Empresa A",
      color: "#0A5483",
    },
    {
      id: 2,
      subtitle: "Gestão de Empresas",
      title: "Empresa B",
      color: "#0A5483",
    },
    {
      id: 3,
      subtitle: "Gestão de Empresas",
      title: "Empresa C",
      color: "#0A5483",
    },
    {
      id: 4,
      subtitle: "Gestão de Empresas",
      title: "Empresa D",
      color: "#0A5483",
    },
  ];

  const [selectedId, setSelectedId] = useState(null);
  const [itemStatus, setItemStatus] = useState(() => {
    // Inicialize o status de cada item como "Desativado"
    const status = {};
    initialItems.forEach((item) => {
      status[item.id] = "Desativado";
    });
    return status;
  });

  const toggleStatus = (id) => {
    setItemStatus((prevStatus) => ({
      ...prevStatus,
      [id]: prevStatus[id] === "Ativado" ? "Desativado" : "Ativado",
    }));
  };

  return (
    <div className="main-container">
      {/* Texto do início */}
      <div className="intro">
        <div className="main-title">
          <h1 className="main-titulo">Bem-Vindo ao Venturo!</h1>
        </div>
        <h4 className="texto-secundario1">
          O Venturos é a solução definitiva para a gestão de recursos
          empresariais,
        </h4>
        <h4 className="texto-secundario2">
          projetado especialmente para atender às necessidades de super
          administradores
        </h4>
        <h4 className="texto-secundario3">
          como você. Explore as funcionalidades e traga mais eficiência e
          clareza para suas operações.
        </h4>
      </div>

      <div className="items-container">
        {initialItems.map((item) => (
          /* Div dos cards com animação */
          <motion.div
            key={item.id}
            className="item-box"
            style={{ backgroundColor: item.color }}
            layoutId={item.id}
            onClick={() => setSelectedId(item.id)}
          >
            <motion.div className="div-titulos-card">
              <motion.h5>{item.subtitle}</motion.h5>
              <motion.h2>{item.title}</motion.h2>
              <motion.h6>Status: {itemStatus[item.id]}</motion.h6>{" "}
            </motion.div>
            {/* Texto exibindo o status */}
            <motion.div>
              <motion.img src={Venturo} className="logo-cards" />
            </motion.div>
          </motion.div>
        ))}

        <AnimatePresence>
          {/* Div do que está dentro dos cards */}
          {selectedId && (
            <motion.div
              className="item-detail"
              layoutId={selectedId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {initialItems.find((item) => item.id === selectedId) && (
                <>
                  {" "}
                  <motion.div className="div-statusbtn">
                    <motion.h5 className="letras">
                      {
                        initialItems.find((item) => item.id === selectedId)
                          .subtitle
                      }
                    </motion.h5>
                    <motion.h2 className="letras">
                      {
                        initialItems.find((item) => item.id === selectedId)
                          .title
                      }
                    </motion.h2>
                    <motion.h6 className="letras">
                      Status: {itemStatus[selectedId]}
                    </motion.h6>{" "}
                    {/* Texto exibindo status */}
                    {/* Div com o botão alterando o status */}
                    <motion.button
                      className={`status-button ${
                        itemStatus[selectedId] === "Ativado"
                          ? "activated"
                          : "deactivated"
                      }`}
                      onClick={() => toggleStatus(selectedId)}
                    >
                      {itemStatus[selectedId] === "Ativado"
                        ? "Desativar"
                        : "Ativar"}
                    </motion.button>
                  </motion.div>
                  {/* Botão de fechar */}
                  <motion.div className="div-fecharbtn">
                    <motion.button
                      className="close-button"
                      onClick={() => setSelectedId(null)}
                    >
                      Fechar
                    </motion.button>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DashboardAdmin;
