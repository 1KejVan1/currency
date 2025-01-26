import { Component } from "react";

import { AddButton } from "../components/Buttons/Add/AddButton";
import { CurrencyBlock } from "../components/Currency Block/CurrencyBlock";
import { List } from "../components/List/List";
import { Abbreviations } from "../enums/Abbreviations";
import { Currency, CurrencyForList } from "../model/Currency";
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
      fixedAllCurrencies: [],
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
    const currency = [...this.state.fixedAllCurrencies].find(
      (curr) => curr.abbreviation === currencyAbbr,
    );

    if (!currency) return;

    this.setState({
      selectedCurrencies: [...this.state.selectedCurrencies, { ...currency }],
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
    const currency = [...this.state.fixedAllCurrencies].find(
      (curr) => curr.abbreviation === currencyAbbr,
    );

    this.setState({
      listCurrencies: sortCurrencies([
        ...this.state.listCurrencies,
        { ...currency },
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

  trackingClick(e) {
    const className = e.srcElement?.parentElement?.className;

    if (!className.includes("add_button") && this.state.isShowingCurrencyList) {
      this.showHideCurrencyList();
    }
  }

  async componentDidMount() {
    const currencies = [];
    const fetchedCurrencies = await fetchCurrencies();

    if (fetchedCurrencies.length) {
      for (let i = 0; i < fetchedCurrencies.length; i++) {
        const name = await fetchName(fetchedCurrencies[i].Cur_ID);
        const currency = Object.create(Currency);
        currency.id = fetchedCurrencies[i].Cur_ID;
        currency.name = name;
        currency.abbreviation = fetchedCurrencies[i].Cur_Abbreviation;
        currency.scale = 1;
        currency.rate =
          fetchedCurrencies[i].Cur_OfficialRate /
          fetchedCurrencies[i].Cur_Scale;

        currencies.push({ ...currency });
      }
    }

    const sortedCurrencies = sortCurrencies(currencies);
    const currenciesForList = sortedCurrencies.filter((curr) => {
      if (isCanDelete(curr.abbreviation)) {
        const obj = Object.create(CurrencyForList);
        obj.id = curr.id;
        obj.name = curr.name;
        obj.abbreviation = curr.abbreviation;

        return { ...obj };
      }
    });

    this.setState({
      allCurrencies: sortedCurrencies,
      listCurrencies: currenciesForList,
      isCurrenciesFetched: true,
    });
  }

  convertToSelectedCurrency(selectedCurAbb, value) {
    const currencies = [...this.state.fixedAllCurrencies];
    const selectedCurr = [...this.state.selectedCurrencies];
    const selectedRate =
      selectedCurAbb === Abbreviations.BYN
        ? 1
        : currencies.find((curr) => curr.abbreviation === selectedCurAbb).rate;

    const bynScale = Math.trunc(value * selectedRate * 100) / 100;

    const convertedCurrencies = currencies.map((curr) => {
      const obj = Object.create(Currency);
      obj.id = curr.id;
      obj.abbreviation = curr.abbreviation;
      obj.name = curr.name;
      obj.rate = curr.rate;

      if (curr.abbreviation === Abbreviations.BYN) {
        obj.scale = bynScale;
      } else if (selectedCurAbb !== curr.abbreviation) {
        obj.scale = Math.trunc((bynScale / curr.rate) * 100) / 100;
      } else {
        obj.scale = value;
      }

      return { ...obj };
    });

    const selCur = selectedCurr.map((curr) => {
      const obj = Object.create(Currency);
      obj.id = curr.id;
      obj.abbreviation = curr.abbreviation;
      obj.name = curr.name;
      obj.scale = convertedCurrencies.find(
        (item) => item.abbreviation === obj.abbreviation,
      ).scale;
      obj.rate = curr.rate;

      return { ...obj };
    });

    this.setState({
      fixedAllCurrencies: [...convertedCurrencies],
      selectedCurrencies: [...selCur],
    });
  }

  componentDidUpdate(_, prevState) {
    if (this.state.isCurrenciesFetched && !prevState.isCurrenciesFetched) {
      const currencies = [...this.state.allCurrencies];

      const bynRateToUSD = currencies.find(
        (curr) => curr.abbreviation === Abbreviations.USD,
      ).rate;

      const bynCurrency = Object.create(Currency);
      bynCurrency.id = 0;
      bynCurrency.abbreviation = Abbreviations.BYN;
      bynCurrency.name = "Белорусский рубль";
      bynCurrency.scale = bynRateToUSD;

      const defaultCurrencies = [{ ...bynCurrency }];

      const test = currencies.map((currency) => {
        const scale = Math.trunc((bynRateToUSD / currency.rate) * 100) / 100;

        if (
          currency.abbreviation === Abbreviations.USD ||
          currency.abbreviation === Abbreviations.EUR ||
          currency.abbreviation === Abbreviations.RUB
        ) {
          defaultCurrencies.push({ ...currency, scale: scale });
        }

        return { ...currency, scale: scale };
      });

      const sortedCurrencies = sortCurrencies([...test, { ...bynCurrency }]);

      this.setState({
        selectedCurrencies: defaultCurrencies,
        isArrayFiltred: true,
        fixedAllCurrencies: sortedCurrencies,
      });
    }
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
                  value={currency.scale}
                  isCanDelete={isCanDelete(currency.abbreviation)}
                  changeValue={this.convertToSelectedCurrency}
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
