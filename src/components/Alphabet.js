import React from "react";

class Alphabet extends React.Component {
  render() {
    return (
      <button
        className="btn btn-primary btn-block"
        disabled={this.props.disabled}
        onMouseOver={this.props.alphabetHovered}
      >
        {this.props.alphabet}
      </button>
    );
  }
}

export default Alphabet;
