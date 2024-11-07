import { Component } from "react";

import { DeleteButton } from "../Buttons/Delete/DeleteButton";
import { TextInput } from "../TextInputs/TextInput";
import styles from "./block.module.css";

export class CurrencyBlock extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div className={styles.block}>
        <div>{this.props.abbreviation}</div>
        {this.props.isCanDelete ? (
          <TextInput />
        ) : (
          <div className={styles.textField_without_delete_button}>
            <TextInput />
          </div>
        )}
        {this.props.isCanDelete && <DeleteButton />}
      </div>
    );
  }
}
