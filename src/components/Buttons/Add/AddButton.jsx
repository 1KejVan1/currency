import { Component } from "react";

import icon from "../../../assets/plus.png";
import { Button } from "../Default/Button";
import styles from "./button.module.css";

export class AddButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Button
        className={styles.add_button}
        onClickFunction={this.props.onClickFunction}
      >
        <img src={icon} className={styles.icon} />
        <span className={styles.title}>Добавить валюту</span>
      </Button>
    );
  }
}
