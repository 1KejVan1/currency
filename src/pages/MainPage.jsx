import { Component } from "react";

import { AddButton } from "../components/Buttons/Add/AddButton";
import { CurrencyBlock } from "../components/Currency Block/CurrencyBlock";
import styles from "./page.module.css";

export class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = { quantityOfCurrency: 0 };
    this.addCurrency = this.addCurrency.bind(this);
  }

  addCurrency() {
    this.setState({ quantityOfCurrency: this.state.quantityOfCurrency + 1 });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.convertor_container}>
          {Array.from({ length: this.state.quantityOfCurrency }).map(() => {
            return <CurrencyBlock />;
          })}
          <AddButton onClickFunction={this.addCurrency} />
        </div>
      </div>
    );
  }
}
