import "./landpage.css" 
import Foguete from "../../../images/Foguete3d.png"

function Landpage() {
    return (
        
        <main className="main-containerLandPg">
            <div className="main-titlePg" >
                <h1>
Boas-Vindas
 </h1>
                </div>


                <div className="Body-LandPG">

<div className="TextBodyLandPg">
    <p>Equipe</p>
    <h1>
        Venturo
        </h1>
    </div>

                    <div className="div-blur">
<img src={Foguete} className="Foguetinho3d"/>

<div className="TextDivBlur"> 
    <p>
    SOFTWERE

        </p>
        <h1>
    ERP
    </h1>
    </div>
 
                        </div>
                    </div>
            </main>
    )
}

export default Landpage;