import React from "react";

class Alphabet extends React.Component {
  render() {
    return (
      <button
        className="btn btn-success btn-block"
        disabled={this.props.disabled}
        onClick={this.props.alphabetClicked}
      >
        {this.props.alphabet}
      </button>
    );
  }
}

export default Alphabet;
