import React from "react";
import Alphabet from "./components/Alphabet";
const BOGGLE_URL = "http://localhost:4000/boggle/generate";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sequence: [],
      answers: [],
      active: null,
      word: "",
      correctAnswers: []
    };
  }
  componentDidMount() {
    fetch(BOGGLE_URL)
      .then(r => r.json())
      .then(data => {
        if (data.sequence) {
          this.setState({
            sequence: data.sequence,
            answers: data.words
          });
        }
      })
      .catch(er => {
        console.log(er);
      });
  }

  disableButton = (x, y) => {
    return (
      (this.state.active
        ? !this.neighbors(x, y).includes(this.state.active)
        : false) ||
      (this.state.word && this.state.word.includes(this.state.sequence[x][y]))
    );
  };

  neighbors = (x, y, neighbors = [x, y]) => {
    [-1, 1].forEach(i => {
      neighbors.push(
        ...[
          `${x + i}, ${y}`,
          `${x}, ${y + i}`,
          `${x + i}, ${y + i}`,
          `${x - i}, ${y + i}`
        ]
      );
    });
    return neighbors;
  };
  submitWord = () => {
    if (this.state.answers.includes(this.state.word)) {
      this.setState(state => {
        return {
          correctAnswers: [...state.correctAnswers, this.state.word],
          word: "",
          active: null
        };
      });
    } else {
      this.setState({
        word: "",
        active: null
      });
    }
  };
  alphabetHovered = (x, y) => {
    this.setState(state => {
      return {
        active: `${x}, ${y}`,
        word: state.word + state.sequence[x][y]
      };
    });
  };
  render = () => {
    return (
      <div className="container mt-3">
        <h1>Boggle</h1>
        <div className="card card-body container mt-5">
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
            <div className="col-md-6 bg-light p-2">
              <div className="font-weight-bold">Correct Answers</div>
              {this.state.correctAnswers.map(answer => {
                return (
                  <li key={answer}>
                    {answer} ({answer.length})
                  </li>
                );
              })}
            </div>
          </div>
          <form
            className="mt-3 row"
            onSubmit={e => {
              e.preventDefault();
              this.submitWord();
            }}
          >
            <input
              type="text"
              value={this.state.word}
              readOnly
              className="form-control col-md-5"
              placeholder="Enter valid word"
            />
            <button className="btn btn-sm btn-primary mx-1 col-md-1">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };
}

export default App;
