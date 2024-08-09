import React from "react";
import ChatBot from '../../images/ChatBotAssist.png'
import "./error.css"

function Error() {
  return (
    <main className="main-container">

      <div className="ContainerError">
      <div className="divError">

<h1>
  404
  </h1>
 

    <div className="spanText">
  
    <span>
  This page does not exist/loading ERROR.
    </span>

  
    </div>
   </div>

   <div className="DivImagemBot">
   <img src={ChatBot} className="ImgChatBot"/>

   </div>


        </div>;
 
    </main>
  );
}

export default Error;