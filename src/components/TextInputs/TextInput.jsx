import { Component, createRef } from "react";

import { identifyTheMobileDevice } from "../../scripts/script";
import styles from "./input.module.css";

export class TextInput extends Component {
  inputLink = createRef(null);

  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e) {
    let value = e.target.value;
    const isMobile = identifyTheMobileDevice();

    if (!isMobile) {
      if (value.includes(",")) {
        value = value.replace(",", ".");
      }
    }

    if (
      value[value.length - 1] !== "." &&
      value[value.length - 1] !== "," &&
      value
    ) {
      this.props.onChangeFunction(value);
    }
  }

  componentDidMount() {
    if (identifyTheMobileDevice()) {
      this.inputLink.current.type = "number";
    }
    this.inputLink.current.value = this.props.value;
  }

  componentDidUpdate() {
    this.inputLink.current.value = this.props.value;

    if (identifyTheMobileDevice()) {
      const pos = this.inputLink.current?.value?.length;

      this.inputLink.current.type = "text";
      this.inputLink.current.selectionStart = pos;
      this.inputLink.current.selectionEnd = pos;
      this.inputLink.current.type = "number";
    }
  }

  render() {
    return (
      <input
        ref={this.inputLink}
        className={styles.input}
        type="text"
        onChange={this.handleOnChange}
      />
    );
  }
}
