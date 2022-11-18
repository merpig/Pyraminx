import "./InstructionPanel.css"

const InstructionPanel = () => {
    return (
        <div className="instructions">
            {/* <p className="i-lines">Author: Sasha Peters</p>
            <p className="i-lines">Contact: 
                <a href="mailto:peteram1@sewanee.edu">
                    peteram1@sewanee.edu
                </a>
            </p> */}
            <p className="i-lines">- Drag on the background to rotate the puzzle</p>
            <p className="i-lines">- Drag on the puzzle to make a move</p>
            {/* <p className="i-lines">
                <a target="#" href="https://www.github.com/merpig">
                    <i className="fa fa-github"></i>
                </a>
                <a target="#" href="https://www.github.com/merpig">
                    <i className="fa fa-linkedin"></i>
                </a>
            </p> */}
        </div>
    )
}

export default InstructionPanel;