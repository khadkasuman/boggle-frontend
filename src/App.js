import React from "react";
import Alphabet from "./components/Alphabet";
const BOGGLE_URL = "https://boggle-suman.herokuapp.com/boggle/generate";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sequence: [],
      answers: [],
      active: null,
      word: "",
      correctAnswers: [],
      countdown: 3 * 60,
      message: "",
      loading: true,
      wordPath: [],
      showAnswers: false
    };
  }
  componentDidMount() {
    fetch(BOGGLE_URL)
      .then(r => r.json())
      .then(data => {
        if (data.sequence) {
          this.setState({
            sequence: data.sequence,
            answers: data.words,
            loading: false
          });
          const timer = setInterval(() => {
            if (this.state.countdown === 0) clearInterval(timer);
            this.setState(state => {
              return {
                countdown: state.countdown--
              };
            });
          }, 1000);
        }
      })
      .catch(er => {
        this.setState({
          loading: false,
          message: "Failed to connect to backend server"
        });
      });
  }

  disableButton = (x, y) => {
    return this.state.active
      ? !this.neighbors(x, y).includes(this.state.active) ||
          this.state.wordPath.includes(`${x}, ${y}`)
      : false;
  };

  neighbors = (x, y, neighbors = [x, y]) => {
    [-1, 1].forEach(i => {
      neighbors.push(
        ...[
          `${x + i}, ${y}`,
          `${x}, ${y + i}`,
          `${x + i}, ${y + i}`,
          `${x - i}, ${y + i}`,
          `${x + i}, ${y - i}`
        ]
      );
    });
    return neighbors;
  };
  submitWord = () => {
    if (this.state.word === "" || this.state.word.length < 3) return;
    if (this.state.correctAnswers.includes(this.state.word)) {
      this.setState({
        message: this.state.word + " is already guessed.",
        word: "",
        active: null,
        wordPath: []
      });
    } else if (this.state.answers.includes(this.state.word)) {
      this.setState(state => {
        return {
          correctAnswers: [...state.correctAnswers, this.state.word],
          word: "",
          active: null,
          wordPath: []
        };
      });
    } else {
      this.setState({
        word: "",
        active: null,
        wordPath: [],
        message: this.state.word + " is not found in dictionary"
      });
    }
  };
  alphabetClicked = (x, y) => {
    this.setState(state => {
      return {
        message: "",
        active: `${x}, ${y}`,
        wordPath: [...state.wordPath, `${x}, ${y}`],
        word: state.word + state.sequence[x][y]
      };
    });
  };

  boggleBoard = () => (
    <div className="row">
      {this.state.sequence.map((row, i) => {
        return row.map((value, j) => {
          return (
            <div className="col-3 p-1" key={j}>
              <Alphabet
                disabled={this.disableButton(i, j)}
                alphabet={value}
                alphabetClicked={() => this.alphabetClicked(i, j)}
              />
            </div>
          );
        });
      })}
    </div>
  );

  wordTyped = word => {
    this.setState({
      word
    });
  };

  toggleAnswerView = () =>{
    this.setState(state =>({
      showAnswers: !state.showAnswers
    }))
  }

  render = () => {
    let timeRemaining = (
      <div className="mb-4">
        <h4>
          {this.state.countdown !== 0 ? (
            <div>Time Remaining {this.state.countdown} Seconds.</div>
          ) : (
            <div>
              Game Over! Total Points:{" "}
              {this.state.correctAnswers.join("").length}
              <br />
              <button onClick={() => window.loaction.reload()}>
                Start New Game
              </button>
            </div>
          )}
        </h4>
      </div>
    );
    let boggleBoard = this.boggleBoard();
    if (this.state.loading) {
      boggleBoard = (
        <div className="m-5 text-center">
          <div className="spinner-border spinner-border-sm"></div>
        </div>
      );
    }
    return (
      <div className="container mt-3">
        <h1>Boggle</h1>
        <div className="card card-body container mt-5">
          <div className="row justify-content-center">{timeRemaining}</div>
          <div className="row">
            <div className="col-md-5">{boggleBoard}</div>
            <div className="col-md-7 bg-light p-2">
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
              onChange={e => {
                this.wordTyped(e.target.value);
              }}
              className="form-control col-md-4"
              placeholder="Enter valid word"
            />
            <button
              className="btn btn-sm btn-primary mx-2 col-md-2"
              disabled={this.state.countdown === 0}
            >
              Submit
            </button>
            <div className="col-md-4">
              {this.state.message ? (
                <span className="text-danger">{this.state.message}</span>
              ) : (
                <span></span>
              )}
            </div>
          </form>
          <div className="mt-5 border-top row">
            <h5 className="col-12">Instruction</h5>
            <div className="col-12">Guess the word from the board( or type it) and press submit to confirm it.</div>
            <button className="col-12 btn btn-link" onClick={() =>{this.toggleAnswerView()}}>Just show me the answers</button>
            {
              this.state.showAnswers? (<div className="col-12">{this.state.answers.toString()}</div>): (<div></div>)
            }
          </div>
        </div>
      </div>
    );
  };
}

export default App;
