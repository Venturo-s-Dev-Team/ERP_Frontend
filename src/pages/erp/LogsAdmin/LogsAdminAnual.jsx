import "../../../App.css"
import LogoVenturoLog from "../../../images/LogoVenturoBlackV.png"
import { useNavigate } from 'react-router-dom';




function LogsAnual () {
    const navigate = useNavigate();
    return(

        <div className="main-container" >
        <div className="headerLogs"> 
        <h2> Logs Anual </h2>
        <img src={LogoVenturoLog} className="LogoEmail"/>
        </div> 


       
<div className="optionsLogs">

<button onClick={() => navigate("/logs_admin")}>
    Mensal
    </button>
    
    <button onClick={() => navigate("/logs_adminAnual")}>
    Anual
    </button>

    </div>

    </div>
       
    )
}

export default LogsAnual;