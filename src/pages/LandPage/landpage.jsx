import "./landpage.css";
import Foguete from "../../images/Foguete3d.png";
import { useNavigate } from "react-router-dom";
import LogoV from "../../images/LogoVenturoV.png";
import Engrenagem from "../../images/Engrenagem.png";

function Landpage() {
  const navigate = useNavigate();

  return (
    <main className="main-containerLandPg">
      <div className="main-titlePg">
        <h1>Boas-Vindas</h1>
        <img src={LogoV} className="Logo" />
      </div>

      <div className="Body-LandPG">
        <div className="TextBodyLandPg">
          <p>Equipe</p>
          <h1>Venturo</h1>
          <div className="SpaceButton">
            <button
              className="ButtonPageLand"
              onClick={() => navigate("/login")}
            >
              Começar
            </button>
          </div>
        </div>

        <div className="div-blur">
          <img src={Foguete} className="Foguetinho3d" />

          <div className="TextDivBlur">
            <p>SOFTWARE</p>
            <div className="alinhando-erp">
              <h1>ERP</h1>
              <img src={Engrenagem} className="Engrena" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Landpage;
