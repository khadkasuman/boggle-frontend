import React from "react";
import Alphabet from "./components/Alphabet";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sequence: [
        ["A", "B", "C", "D"],
        ["E", "F", "G", "H"],
        ["I", "J", "K", "L"],
        ["M", "N", "O", "P"]
      ],
      active: null,
      word: ""
    };
  }
  disableButton = (x, y) => {
    return (this.state.active
      ? !this.neighbors(x, y).includes(this.state.active)
      : false) || (this.state.word && this.state.word.includes(this.state.sequence[x][y]));
  };

  neighbors = (x, y, neighbors = [x, y]) => {
    return [`${x}, ${y}`, `${x + 1}, ${y}`, `${x - 1}, ${y}`, `${x}, ${y + 1}`];
  };

  alphabetHovered = (x, y) => {
    this.setState(state =>{
      return{
        active: `${x}, ${y}`,
        word: state.word + state.sequence[x][y]
      }
    });
  };
  render = () => {
    return (
      <div className="container mt-3">
        <h1>Boggle</h1>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                {this.state.sequence.map((row, i) => {
                  return row.map((value, j) => {
                    return (
                      <div className="col-3 p-1" key={j}>
                        <Alphabet
                          disabled={this.disableButton(i, j)}
                          alphabet={value}
                          alphabetHovered={() => this.alphabetHovered(i, j)}
                        />
                      </div>
                    );
                  });
                })}
              </div>
            </div>
            <div className="col-md-6 bg-light p-1">
              <b>Correct Answers</b>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <input
            type="text"
            value={this.state.word}
            readOnly
            className="form-control"
            placeholder="Enter valid word"
          />
        </div>
      </div>
    );
  };
}

export default App;
