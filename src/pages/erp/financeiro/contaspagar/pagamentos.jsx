import React from "react";
import { FaUserLarge } from "react-icons/fa6";

function Pagamentos() {
  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Pagamentos Programados</h3>
      </div>

<div className="divEstatistcPgFunc">
<button>
<FaUserLarge className="icon-PagFunc" />
<h1>
Funcionários: 33
</h1>
        </button>

        <button>
        <FaUserLarge className="icon-PagFunc" />
          <h1>
          Funcionários a receber: 13
            </h1>
          </button>
</div>
   


    </main>
  );
}

export default Pagamentos;
