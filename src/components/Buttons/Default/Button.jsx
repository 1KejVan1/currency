import { Component } from "react";

import styles from "./button.module.css";

export class Button extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    this.props.onClickFunction();
  }

  render() {
    return (
      <button
        className={this.props.className ? this.props.className : styles.button}
        onClick={this.handleOnClick}
      >
        {this.props.children}
      </button>
    );
  }
}

Button.defaultProps = { onClickFunction: Function.prototype };
