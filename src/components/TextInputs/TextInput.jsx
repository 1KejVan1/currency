import { Component, createRef } from "react";

import styles from "./input.module.css";

export class TextInput extends Component {
  refLink = createRef(null);

  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e) {
    this.setState({ value: e.target.value });
    this.props.onChangeFunction(e.target.value);
  }

  componentDidMount() {
    this.refLink.current.value = this.props.value;
  }

  componentDidUpdate() {
    this.refLink.current.value = this.props.value;
  }

  render() {
    return (
      <input
        ref={this.refLink}
        className={styles.input}
        type="text"
        onChange={this.handleOnChange}
      />
    );
  }
}
