import { Component } from "react";

import { AddButton } from "../components/Buttons/Add/AddButton";
import { CurrencyBlock } from "../components/Currency Block/CurrencyBlock";
import { List } from "../components/List/List";
import { Abbreviations } from "../enums/Abbreviations";
import { Currency } from "../model/Currency";
import {
  fetchCurrencies,
  fetchName,
  isCanDelete,
  sortCurrencies,
} from "../scripts/script";
import styles from "./page.module.css";

export class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingCurrencyList: false,
      selectedCurrencies: [],
      listCurrencies: [],
      allCurrencies: [],
      isArrayFiltred: false,
    };
    this.addCurrency = this.addCurrency.bind(this);
    this.addCurrencyToList = this.addCurrencyToList.bind(this);
    this.checkIsListShowing = this.checkIsListShowing.bind(this);
    this.convertToSelectedCurrency = this.convertToSelectedCurrency.bind(this);
    this.deleteCurrency = this.deleteCurrency.bind(this);
    this.deleteCurrencyFromList = this.deleteCurrencyFromList.bind(this);
    this.showHideCurrencyList = this.showHideCurrencyList.bind(this);
    this.trackingClick = this.trackingClick.bind(this);
  }

  addCurrency(currencyAbbr = "") {
    const currency = [...this.state.allCurrencies].find(
      (curr) => curr.abbreviation === currencyAbbr,
    );

    if (!currency) return;

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
      listCurrencies: sortCurrencies([...this.state.listCurrencies, currency]),
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

  trackingClick(e) {
    const className = e.srcElement?.parentElement?.className;

    if (!className.includes("add_button") && this.state.isShowingCurrencyList) {
      this.showHideCurrencyList();
    }
  }

  // shouldComponentUpdate(_, nextState) {
  //   for (let i = 0; i < nextState.allCurrencies.length; i++) {
  //     const obj = nextState.allCurrencies[i];

  //     for (const key of Object.keys(obj)) {
  //       console.log(key, obj[key]);
  //     }
  //   }

  //   return true;
  // }

  async componentDidMount() {
    if (this.state.allCurrencies.length) return;
    const currencies = [];
    const fetchedCurrencies = await fetchCurrencies();

    if (fetchedCurrencies.length) {
      for (let i = 0; i < fetchedCurrencies.length; i++) {
        const name = await fetchName(fetchedCurrencies[i].Cur_ID);
        currencies.push(
          new Currency(
            fetchedCurrencies[i].Cur_ID,
            fetchedCurrencies[i].Cur_Abbreviation,
            name,
            1,
            fetchedCurrencies[i].Cur_OfficialRate /
              fetchedCurrencies[i].Cur_Scale,
          ),
        );
      }

      const sortedCurrencies = sortCurrencies(currencies);

      this.setState({
        allCurrencies: sortedCurrencies,
        listCurrencies: sortedCurrencies.filter((curr) =>
          isCanDelete(curr.abbreviation),
        ),
      });
    }
  }

  convertToSelectedCurrency(selectedCurAbb, value) {
    const currencies = [...this.state.allCurrencies];
    const selectedRate = currencies.find(
      (curr) => curr.abbreviation === selectedCurAbb,
    ).rate;
    const bynScale = value * selectedRate;

    console.log(currencies);

    currencies.forEach(
      (curr) => (curr.scale = Math.trunc((bynScale / curr.rate) * 100) / 100),
    );

    this.setState({ allCurrencies: currencies });
  }

  componentDidUpdate(_, prevState) {
    if (
      this.state.allCurrencies.length != 0 &&
      prevState.allCurrencies.length == 0 &&
      this.state.isArrayFiltred == false
    ) {
      const currencies = [...this.state.allCurrencies];

      const bynRateToUSD = currencies.find(
        (curr) => curr.abbreviation === Abbreviations.USD,
      ).rate;

      const bynCurrency = new Currency(
        0,
        Abbreviations.BYN,
        "Белорусский рубль",
        bynRateToUSD,
      );

      const defaultCurrencies = [bynCurrency];

      currencies.forEach((currency) => {
        if (
          currency.abbreviation === Abbreviations.USD ||
          currency.abbreviation === Abbreviations.EUR ||
          currency.abbreviation === Abbreviations.RUB
        ) {
          // currency.scale =
          //   Math.trunc((bynRateToUSD / currency.rate) * 100) / 100;

          defaultCurrencies.push(currency);
        }
      });

      this.setState({
        selectedCurrencies: defaultCurrencies,
        isArrayFiltred: true,
      });

      return;
    }
    if (
      this.state.selectedCurrencies.length &&
      prevState.selectedCurrencies.length == 0
    ) {
      const currencies = [...this.state.allCurrencies];

      const bynRateToUSD = currencies.find(
        (curr) => curr.abbreviation === Abbreviations.USD,
      ).rate;

      currencies.forEach((currency) => {
        currency.scale = Math.trunc((bynRateToUSD / currency.rate) * 100) / 100;
      });

      const test = [];

      for (let i = 0; i < currencies.length; i++) {
        const obj = new Currency(
          currencies[i].id,
          currencies[i].abbreviation,
          currencies[i].name,
          currencies[i].scale,
          currencies[i].rate,
        );
        test.push(obj);
      }

      test.push(
        this.state.selectedCurrencies.find(
          (curr) => curr.abbreviation === Abbreviations.BYN,
        ),
      );

      this.setState({ allCurrencies: [], listCurrencies: [] });

      // this.setState({
      //   allCurrencies: [
      //     ...currencies,
      //     this.state.selectedCurrencies.find(
      //       (curr) => curr.abbreviation === Abbreviations.BYN,
      //     ),
      //   ],
      // });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.trackingClick);
  }

  render() {
    // console.log(this.state.allCurrencies);
    return (
      <div className={styles.container}>
        <div className={styles.convertor_container}>
          <div className={styles.currency_section}>
            {this.state.selectedCurrencies.map((currency) => {
              return (
                <CurrencyBlock
                  key={currency.abbreviation}
                  abbreviation={currency.abbreviation}
                  value={currency.scale}
                  isCanDelete={isCanDelete(currency.abbreviation)}
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
