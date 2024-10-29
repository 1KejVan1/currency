import { Component } from "react";

import classNames from "classnames";

import { ListItem } from "../ListItem/ListItem";
import styles from "./list.module.css";

export class List extends Component {
  constructor(props) {
    super();
    this.state = { isOverflown: false };
  }

  isOverflown(id) {
    const element = document.getElementById(id);

    return (
      element.getBoundingClientRect().bottom >
      document.documentElement.clientHeight
    );
  }

  componentDidMount() {
    this.setState({ isOverflown: this.isOverflown("list") });
  }

  render() {
    return (
      <div
        id="list"
        className={classNames(
          styles.list,
          this.state.isOverflown && styles.list_bottom,
        )}
      >
        {this.props.currencies.map((item) => {
          return (
            <ListItem
              key={item.abbreviation}
              Abbreviation={item.abbreviation}
              CurName={item.cur_name}
            />
          );
        })}
      </div>
    );
  }
}

List.defaultProps = { currencies: [] };
