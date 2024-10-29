import { Component } from "react";

import { AddButton } from "../components/Buttons/Add/AddButton";
import { CurrencyBlock } from "../components/Currency Block/CurrencyBlock";
import { List } from "../components/List/List";
import { Currency } from "../model/Currency";
import styles from "./page.module.css";

export class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantityOfCurrency: 0,
      isShowingCurrencyList: false,
      currencies: [],
      isNameFetched: false,
    };
    this.addCurrency = this.addCurrency.bind(this);
    this.showHideCurrencyList = this.showHideCurrencyList.bind(this);
    this.checkIsListShowing = this.checkIsListShowing.bind(this);
  }

  addCurrency() {
    this.setState({ quantityOfCurrency: this.state.quantityOfCurrency + 1 });
  }

  showHideCurrencyList() {
    this.setState({ isShowingCurrencyList: !this.state.isShowingCurrencyList });
  }

  checkIsListShowing() {
    if (this.state.isShowingCurrencyList) {
      this.setState({ isShowingCurrencyList: false });
    }
  }

  // запросы сделать

  async fetchName(id) {
    const obj = await fetch(`https://api.nbrb.by/exrates/currencies/${id}`);

    if (obj.ok) {
      const resJson = await obj.json();
      return resJson.Cur_Name;
    }

    return "";
  }

  componentDidMount() {
    const currencies = [];
    fetch("https://api.nbrb.by/exrates/rates?periodicity=0")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(async (res) => {
        for (let i = 0; i < res.length; i++) {
          const name = await this.fetchName(res[i].Cur_ID);
          currencies.push(
            new Currency(
              res[i].Cur_ID,
              res[i].Cur_Abbreviation,
              name,
              res[i].Cur_OfficialRate,
            ),
          );
        }

        this.setState({ currencies: [...currencies] });
      })
      .catch((e) => {
        console.error(e);
      });

    console.log(currencies);
  }

  render() {
    return (
      <div className={styles.container} onClick={this.showHideCurrencyList}>
        <div className={styles.convertor_container}>
          <div className={styles.currency_section}>
            {Array.from({ length: this.state.quantityOfCurrency }).map(() => {
              return <CurrencyBlock />;
            })}
          </div>
          <div className={styles.add_button_section}>
            <AddButton onClickFunction={this.showHideCurrencyList} />
            {this.state.isShowingCurrencyList && <List />}
          </div>
        </div>
      </div>
    );
  }
}
