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
      quantityOfCurrency: 5,
      isShowingCurrencyList: false,
      currencies: [],
      currenciesForList: [],
      isNameFetched: false,
      isArrayFiltred: false,
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

        this.setState({ currenciesForList: [...currencies] });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  componentDidUpdate(_, prevState) {
    if (
      this.state.currenciesForList.length != 0 &&
      prevState.currenciesForList.length == 0 &&
      this.state.isArrayFiltred == false
    ) {
      const defaultCurrencies = [new Currency(0, "BLR", "Белорусский рубль")];
      const currencies = [...this.state.currenciesForList];
      currencies.map((currency) => {
        if (
          currency.abbreviation === "USD" ||
          currency.abbreviation === "EUR" ||
          currency.abbreviation === "RUB"
        ) {
          defaultCurrencies.push(currency);
        }
      });

      this.setState({
        currencies: [...defaultCurrencies],
        isArrayFiltred: true,
        currenciesForList: [...defaultCurrencies],
      });
    }
    // if (prevState.isArrayFiltred !== this.state.isArrayFiltred) {
    //   const currencies = [...this.state.currenciesForList];
    //   const filteredArray = currencies.filter((currency) => {
    //     if (
    //       currency.abbreviation !== "USD" &&
    //       currency.abbreviation !== "EUR" &&
    //       currency.abbreviation !== "RUB"
    //     ) {
    //       return currency;
    //     }
    //   });

    //   console.log(filteredArray);

    //   this.setState({ currenciesForList: filteredArray });
    // }
  }

  //---- РАЗОБРАТЬСЯ СО ВТОРЫМ МАССИВОМ

  isCanDelete(abbreviation) {
    if (
      abbreviation == "BLR" ||
      abbreviation == "USD" ||
      abbreviation == "EUR" ||
      abbreviation == "RUB"
    ) {
      return false;
    } else return true;
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.convertor_container}>
          <div className={styles.currency_section}>
            {this.state.currencies.map((currency) => {
              return (
                <CurrencyBlock
                  key={currency.abbreviation}
                  abbreviation={currency.abbreviation}
                  value={currency.value}
                  isCanDelete={this.isCanDelete(currency.abbreviation)}
                />
              );
            })}
          </div>
          <div className={styles.add_button_section}>
            <AddButton onClickFunction={this.showHideCurrencyList} />
            {this.state.isShowingCurrencyList && (
              <List currencies={this.state.currenciesForList} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
