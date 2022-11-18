import "./index.css";

const Modal = ({modal,toggleModal}) => {
    let closeModal = () => {
        toggleModal(false);
    }
    return (
        modal?
        <div className="modal-wrapper" onClick={closeModal}>
            <div className="modal-container">
                <div className="modal-header">
                    <b>Instructions</b>
                </div>
                <div className="modal-body">
                    <br></br>
                    Drag anywhere on the background to rotate the puzzle
                    <hr></hr>
                    Drag anywhere on the puzzle to make a move
                    <hr></hr>
                    Author: Sasha Peters
                    <br></br>
                    <a target="#" href="https://www.github.com/merpig">
                        <i className="fa fa-github"></i>
                    </a>
                    <a target="#" href="https://www.github.com/merpig">
                        <i className="fa fa-linkedin"></i>
                    </a>
                    <hr></hr>
                    Site design / program © 2022 Sasha Peters
                    <p></p>
                </div>
            </div>
        </div>:[]
    )
}

export default Modal;