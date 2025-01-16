import { Component } from "react";

import { DeleteButton } from "../Buttons/Delete/DeleteButton";
import { TextInput } from "../TextInputs/TextInput";
import styles from "./block.module.css";

export class CurrencyBlock extends Component {
  constructor(props) {
    super(props);

    this.deleteCurrency = this.deleteCurrency.bind(this);
  }

  deleteCurrency() {
    this.props.deleteFunction(this.props.abbreviation);
  }

  render() {
    return (
      <div className={styles.block}>
        <div>{this.props.abbreviation}</div>
        {this.props.isCanDelete ? (
          <TextInput value={this.props.value} />
        ) : (
          <div className={styles.input_without_delete_button}>
            <TextInput value={this.props.value} />
          </div>
        )}
        {this.props.isCanDelete && (
          <div className={styles.delete_button_container}>
            <DeleteButton onClickFunction={this.deleteCurrency} />
          </div>
        )}
      </div>
    );
  }
}
