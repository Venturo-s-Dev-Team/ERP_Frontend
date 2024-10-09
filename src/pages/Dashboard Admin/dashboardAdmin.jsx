import React from "react";
import "./dashboardAdmin.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgCloseR } from "react-icons/cg";
import logoImage from "./img.png";

const itemsData = [
  {
    id: 1,
    subtitle: "Gestão de Empresas",
    title: "Empresa 1",
    status: "Autorizado",
    img: logoImage,
    gestor: "Veiga",
    cnpj: 1234567,
    email: "veiga@gmail.com",
  },
  {
    id: 2,
    subtitle: "Gestão de Empresas",
    title: "Empresa 2",
    status: "Autorizado",
    img: logoImage,
    gestor: "Veiga",
    cnpj: 1234567,
    email: "veiga@gmail.com",
  },
  {
    id: 3,
    subtitle: "Gestão de Empresas",
    title: "Empresa 3",
    status: "Autorizado",
    img: logoImage,
    gestor: "Veiga",
    cnpj: 1234567,
    email: "veiga@gmail.com",
  },
];

function HomeAdmin() {
  const [selectedId, setSelectedId] = useState(null);
  const [items, setItems] = useState(itemsData); // Usando estado para os itens

  const toggleStatus = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "Autorizado" ? "Desautorizado" : "Autorizado",
            }
          : item
      )
    );
  };

  return (
    <main>
      {/* Texto de boas vindas e introdução */}
      <div>
        <h1 className="main-titleDBAdmin">Bem-Vindo ao Venturo!</h1>
        <h4 className="IntroText-DBAdmin-1">
          O Venturos é a solução definitiva para a gestão de recursos
          empresariais,
        </h4>
        <h4 className="IntroText-DBAdmin-2">
          projetado especialmente para atender às necessidades de super
          administradores
        </h4>
        <h4 className="IntroText-DBAdmin-3">
          como você. Explore as funcionalidades e traga mais eficiência e
          clareza para suas operações.
        </h4>
      </div>

      <div className="ContainerEmp-DBAdmin">
        {/* Container - Parte Externa */}
        {items.map((item) => (
          <motion.div
            layoutId={item.id}
            className="ContainerExt-DBAdmin"
            onClick={() => setSelectedId(item.id)}
          >
            <motion.h5>{item.subtitle}</motion.h5>
            <motion.h2>{item.title}</motion.h2>
            <motion.h6>Status: {item.status}</motion.h6>
          </motion.div>
        ))}
        {/* Container - Parte Interna */}
        <AnimatePresence>
          {selectedId &&
            items.map((item) => (
              <motion.div
                layoutId={selectedId}
                className="ContainerInt-DBAdmin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Div - Botão de Fechar do Container */}
                <motion.div>
                  <motion.button
                    className="ContainerBtn-DBAdmin"
                    onClick={() => setSelectedId(null)}
                  >
                    <CgCloseR className="ContainerIcone" />
                  </motion.button>
                </motion.div>

                {/* Div - Container com Logo */}
                <motion.div className="LogoEmpresa-DBAdmin">
                  {item.img ? (
                    <img src={item.img} className="LogoEmpresa-Img-DBAdmin" />
                  ) : (
                    <div style={{ width: 100, height: 100 }}></div>
                  )}
                </motion.div>

                {/* Div - Container sem logo */}
                <motion.div
                  className={`ContainerConteudo ${
                    item.img ? "has-logo" : "no-logo"
                  }`}
                >
                  <motion.h2 className="ContainerInt-Title">
                    {item.title}
                  </motion.h2>

                  <motion.h6 className="ContainerInt-Dados">
                    Status: {item.status}
                  </motion.h6>

                  {/* Dados da Empresa */}
                  <details>
                    <summary className="Summary-ContainerInt">
                      Dados da Empresa
                    </summary>
                    <motion.p className="Dados-ContainerInt">
                      <strong> ID: </strong> {item.id}{" "}
                    </motion.p>
                    <motion.p className="Dados-ContainerInt">
                      <strong> Gestor: </strong> {item.gestor}{" "}
                    </motion.p>
                    <motion.p className="Dados-ContainerInt">
                      <strong> CNPJ: </strong> {item.cnpj}
                    </motion.p>
                    <motion.p className="Dados-ContainerInt">
                      <strong> Email: </strong> {item.email}
                    </motion.p>
                  </details>

                  {/*  Botões para "Ver Mais" e "Autorizar" */}
                  <motion.div className="ContainerInt-BtnBox">
                    <motion.button
                      className={
                        item.status === "Autorizado"
                          ? "Desautorizar-DBAdmin"
                          : "Autorizar-DBAdmin"
                      }
                      onClick={() => toggleStatus(item.id)}
                    >
                      {item.status === "Autorizado" ? "Desativar" : "Autorizar"}
                    </motion.button>
                    <motion.div className="VerMaisDiv-DBAdmin">
                      <motion.button className="VerMaisBtn-DBAdmin">
                        {" "}
                        Ver Mais
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default HomeAdmin;
