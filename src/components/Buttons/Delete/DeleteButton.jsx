import { Component } from "react";

import icon from "../../../assets/close.png";
import { Button } from "../Default/Button";
import styles from "./delete.module.css";

export class DeleteButton extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    this.props.onClickFunction();
  }

  render() {
    return (
      <Button
        onClickFunction={this.handleOnClick}
        className={styles.delete_button}
      >
        <img className={styles.img} src={icon} />
      </Button>
    );
  }
}

DeleteButton.defaultProps = { onClickFunction: Function.prototype };
