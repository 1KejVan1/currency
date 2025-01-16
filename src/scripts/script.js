import { Abbreviations } from "../enums/Abbreviations";

function isCanDelete(abbreviation) {
  return (
    abbreviation != Abbreviations.BYN &&
    abbreviation != Abbreviations.USD &&
    abbreviation != Abbreviations.RUB &&
    abbreviation != Abbreviations.EUR
  );
}

function sortCurrencies(currencies = []) {
  return currencies.sort((a, b) =>
    a.abbreviation.localeCompare(b.abbreviation),
  );
}

async function fetchName(id) {
  const obj = await fetch(`https://api.nbrb.by/exrates/currencies/${id}`);

  if (obj.ok) {
    const resJson = await obj.json();
    return resJson.Cur_Name;
  }

  return "";
}

async function fetchCurrencies() {
  const obj = await fetch("https://api.nbrb.by/exrates/rates?periodicity=0");

  if (obj.ok) {
    const currencies = await obj.json();

    return currencies;
  }

  return [];
}

export { isCanDelete, sortCurrencies, fetchName, fetchCurrencies };
