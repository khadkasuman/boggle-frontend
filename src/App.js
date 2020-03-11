import React from "react";
import "./styles.css";
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
      active: null
    };
  }
  disableButton = (x, y) => {
    return this.state.active === [x, y];
  };
  alphabetClicked = (x, y) => {
    console.log([x, y]);
    this.setState({
      active: [x, y]
    });
  };
  render = () => {
    return (
      <div className="App">
        <h1>Boggle</h1>
        <div className="Container">
          {this.state.sequence.map((row, i) => {
            return (
              <div className="FlexRow" key={i}>
                {row.map((value, j) => {
                  return (
                    <Alphabet
                      key={j}
                      disabled={this.disableButton(i, j)}
                      alphabet={value}
                      alphabetClicked={() => this.alphabetClicked(i, j)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
}

export default App;
