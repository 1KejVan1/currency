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

  // componentDidMount() {
  //   fetch("https://api.nbrb.by/exrates/currencies/513")
  //     .then((res) => {
  //       if (res.ok) {
  //         return res.json();
  //       }
  //     })
  //     .then((res) => console.log(res))
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.convertor_container}>
          <div className={styles.currency_section}>
            {Array.from({ length: this.state.quantityOfCurrency }).map(() => {
              return <CurrencyBlock />;
            })}
          </div>
          <div className={styles.add_button_section}>
            <AddButton onClickFunction={this.addCurrency} />
          </div>
        </div>
      </div>
    );
  }
}
