import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import jsonTutorialData from "./dataTutorial.json";
import Tutorial from "./XAI_tutorial";

import zeki_logo from "./logo/zeki-logo.svg";
import bmas_logo from "./logo/bmas-logo.svg";
import goki_logo from "./logo/goki-logo.svg";
import {faHouse as home_button} from '@fortawesome/free-solid-svg-icons'


function App() {

  const handleHomeButton = () => {
    window.location.href = "/go-ki-demo/index.html";
  };

  return (
    <>
      <div class="logos">
        <img id="zeki_logo" src={zeki_logo} alt="zeki_logo" />
        <img id="goki_logo" src={goki_logo} alt="goki_logo" />
      </div>

      <div className="App">

        <div class="home_button">
          <button class="page_switch_button home_page_button"
                  onClick={handleHomeButton}>
            <FontAwesomeIcon icon={home_button} />
          </button>
        </div>

          <Tutorial data={jsonTutorialData}/>

      
      </div>

      <div class="footer_logo">
        <p id="bmas_text">Funded by </p>
        <img id="bmas_logo" src={bmas_logo} alt="bmas_logo" />
      </div>

    </>

  );
}

export default App;