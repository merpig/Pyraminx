import React, { useState } from "react";
import "./index.css";
import 'react-dropdown/style.css'
import Modal from "../Modal"

const Navbar = () => {

  let [modal,toggleModal] = useState(false);

  return (
    <nav className="navbar navbar-dark fixed-top">
      <ul className="nav nav-justified mr-auto">
        <li className="nav-item nav-fix-for-edge">
          <p className="navbar-brand" style={{ color: "lightgray" }}><b>PyraMinx</b></p>

          {/*Open model here. Show bunch of settings. Pass changeSettings down to component to apply changes*/}
          
        </li>
      </ul>
      <div style={{ float: "right", height: "100%" }} >
        <button id="infoBtn" onClick={()=>toggleModal(true)}>Info</button>
        <button id="fullscreenBtn" value="true">Fullscreen</button>
        <Modal modal={modal} toggleModal={toggleModal} />
      </div>
    </nav>)
};

export default Navbar;