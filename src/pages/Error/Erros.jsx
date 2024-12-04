import React from "react";
import { useLocation } from "react-router-dom";
import ChatBot from "../../images/ChatBotAssist.png";
import "./Error.css";

function Error({ errorCode }) {
  const location = useLocation();
  const code = errorCode || location.state?.errorCode || 404;

  return (
    <main className="main-containerError">
      <div className="ContainerError">
        <div className="divError">
          <h1>{code}</h1>
        </div>

        <div className="DivImagemBot">
          <img src={ChatBot} className="ImgChatBot" alt="Chat Bot" />
          <h3>Oops... ERROR {code} occurred.</h3>
        </div>
      </div>
    </main>
  );
}

export default Error;