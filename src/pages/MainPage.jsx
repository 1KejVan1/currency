import { Component } from "react";

import { AddButton } from "../components/Buttons/Add/AddButton";
import { CurrencyBlock } from "../components/Currency Block/CurrencyBlock";
import { List } from "../components/List/List";
import { Abbreviations } from "../enums/Abbreviations";
import { Currency } from "../model/Currency";
import styles from "./page.module.css";

export class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingCurrencyList: false,
      selectedCurrencies: [],
      listCurrencies: [],
      allCurrencies: [],
      isNameFetched: false,
      isArrayFiltred: false,
    };
    this.addCurrency = this.addCurrency.bind(this);
    this.addCurrencyToList = this.addCurrencyToList.bind(this);
    this.sortCurrencies = this.sortCurrencies.bind(this);
    this.deleteCurrency = this.deleteCurrency.bind(this);
    this.deleteCurrencyFromList = this.deleteCurrencyFromList.bind(this);
    this.showHideCurrencyList = this.showHideCurrencyList.bind(this);
    this.checkIsListShowing = this.checkIsListShowing.bind(this);
    this.trackingClick = this.trackingClick.bind(this);
  }

  addCurrency(currencyAbbr = "") {
    const currency = [...this.state.allCurrencies].find(
      (curr) => curr.abbreviation === currencyAbbr,
    );

    this.setState({
      selectedCurrencies: [...this.state.selectedCurrencies, currency],
    });

    this.showHideCurrencyList();
    this.deleteCurrencyFromList(currencyAbbr);
  }

  deleteCurrencyFromList(currencyAbbr) {
    const currencies = [...this.state.listCurrencies].filter(
      (curr) => curr.abbreviation !== currencyAbbr,
    );

    this.setState({ listCurrencies: [...currencies] });
  }

  deleteCurrency(currencyAbbr = "") {
    const currencies = [...this.state.selectedCurrencies].filter(
      (curr) => curr.abbreviation !== currencyAbbr,
    );

    this.setState({
      selectedCurrencies: [...currencies],
    });

    this.addCurrencyToList(currencyAbbr);
  }

  addCurrencyToList(currencyAbbr) {
    const currency = [...this.state.allCurrencies].find(
      (curr) => curr.abbreviation === currencyAbbr,
    );

    this.setState({
      listCurrencies: this.sortCurrencies([
        ...this.state.listCurrencies,
        currency,
      ]),
    });
  }

  showHideCurrencyList() {
    if (this.state.isShowingCurrencyList) {
      window.removeEventListener("click", this.trackingClick);
    } else {
      window.addEventListener("click", this.trackingClick);
    }

    this.setState({ isShowingCurrencyList: !this.state.isShowingCurrencyList });
  }

  checkIsListShowing() {
    if (this.state.isShowingCurrencyList) {
      this.setState({ isShowingCurrencyList: false });
    }
  }

  sortCurrencies(currencies = []) {
    return currencies.sort((a, b) =>
      a.abbreviation.localeCompare(b.abbreviation),
    );
  }

  async fetchName(id) {
    const obj = await fetch(`https://api.nbrb.by/exrates/currencies/${id}`);

    if (obj.ok) {
      const resJson = await obj.json();
      return resJson.Cur_Name;
    }

    return "";
  }

  trackingClick(e) {
    const className = e.srcElement.parentElement.className;
    if (!className.includes("add_button") && this.state.isShowingCurrencyList) {
      this.showHideCurrencyList();
    }
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

        this.setState({
          allCurrencies: [...this.sortCurrencies(currencies)],
          listCurrencies: [
            ...this.sortCurrencies(
              currencies.filter((curr) => this.isCanDelete(curr.abbreviation)),
            ),
          ],
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  componentDidUpdate(_, prevState) {
    if (
      this.state.allCurrencies.length != 0 &&
      prevState.allCurrencies.length == 0 &&
      this.state.isArrayFiltred == false
    ) {
      const defaultCurrencies = [new Currency(0, "BLR", "Белорусский рубль")];
      const currencies = [...this.state.allCurrencies];
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
        selectedCurrencies: [...defaultCurrencies],
        isArrayFiltred: true,
        allCurrencies: [...defaultCurrencies],
      });
    }
  }

  isCanDelete(abbreviation) {
    return (
      abbreviation != Abbreviations.BLR &&
      abbreviation != Abbreviations.USD &&
      abbreviation != Abbreviations.RUB &&
      abbreviation != Abbreviations.EUR
    );
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.trackingClick);
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.convertor_container}>
          <div className={styles.currency_section}>
            {this.state.selectedCurrencies.map((currency) => {
              return (
                <CurrencyBlock
                  key={currency.abbreviation}
                  abbreviation={currency.abbreviation}
                  value={currency.value}
                  isCanDelete={this.isCanDelete(currency.abbreviation)}
                  deleteFunction={this.deleteCurrency}
                />
              );
            })}
          </div>
          <div className={styles.add_button_section}>
            <AddButton onClickFunction={this.showHideCurrencyList} />
            {this.state.isShowingCurrencyList && (
              <List
                currencies={this.state.listCurrencies}
                selectItem={this.addCurrency}
                hideList={this.showHideCurrencyList}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
