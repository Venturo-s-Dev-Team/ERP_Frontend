import "../../../App.css"
import { useNavigate } from 'react-router-dom';
import LogoVenturoLog from "../../../images/LogoVenturoBlackV.png"

function LogsAdmin () {
    const navigate = useNavigate();

    return(

        <div className="main-container" >
<div className="headerLogs"> 
<h2> Logs Mensal </h2>
<img src={LogoVenturoLog} className="LogoEmail"/>
</div>

<div className="containerLogs">
    
<div className="optionsLogs">

<button onClick={() => navigate("/logs_admin")}>
    Mensal
    </button>
    
    <button onClick={() => navigate("/logs_adminAnual")}>
    Anual
    </button>

    </div>

    </div>

            </div>
    )
}

export default LogsAdmin;