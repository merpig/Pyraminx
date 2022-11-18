import "./Menu.css";
import Main from "../Main/Main";
// import ColorPicker from "../ColorPicker/ColorPicker";
// import Solver from "../Solver/Solver"
import { useState } from "react";

const Menu = ({setTurn,getTurn,rightHints,leftHints,getPyra,getCpVars,getCounter,setMoveLogIndex,setMoveQueue,resetMegaMinx,reset,setCurrentFunction,currentFunction,speed,setSpeed,pyraObject}) => {

    const [menuId,setMenuId] = useState(0);

    let menus = [
        <Main 
            setMoveQueue={setMoveQueue}
            reset={reset}
            setMenuId={setMenuId}
            setCurrentFunction={setCurrentFunction}
            currentFunction={currentFunction}
            speed={speed}
            setSpeed={setSpeed}
            setMoveLogIndex={setMoveLogIndex}
        />,
        // <ColorPicker 
        //     setMenuId={setMenuId}
        //     setCurrentFunction={setCurrentFunction}
        //     resetMegaMinx={resetMegaMinx}
        //     getPyra={getPyra}
        //     getCpVars={getCpVars}
        // />,
        // <Solver
        //     setMenuId={setMenuId}
        //     setMoveQueue={setMoveQueue}
        //     setCurrentFunction={setCurrentFunction}
        //     pyraObject={pyraObject}
        //     getPyra={getPyra}
        //     speed={speed}
        //     setSpeed={setSpeed}
        //     getCounter={getCounter}
        //     rightHints={rightHints}
        //     leftHints={leftHints}
        //     setTurn={setTurn}
        //     getTurn={getTurn}
        // />,
        <div></div>,
        <div></div>,
        <div></div>
    ]

    return (
        <div className="menu-box-container">
            <div className="menu-box">
                {/* {menus[menuId]} */}
                {menus[0]}
            </div>
        </div>
    );

}

export default Menu;