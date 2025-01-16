import { Component } from "react";

import styles from "./input.module.css";

export class TextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value, isFocus: false };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <input
        className={styles.input}
        type="text"
        onChange={this.handleOnChange}
        value={this.state.value}
      />
    );
  }
}
