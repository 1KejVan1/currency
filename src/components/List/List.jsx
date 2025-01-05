import { Component } from "react";

import classNames from "classnames";

import { ListItem } from "../ListItem/ListItem";
import styles from "./list.module.css";

export class List extends Component {
  constructor(props) {
    super();
    this.state = { isOverflown: false };
    this.checkOverflown = this.checkOverflown.bind(this);
  }

  checkOverflown() {
    const element = document.getElementById("list");

    this.setState({
      isOverflown:
        element.getBoundingClientRect().bottom >
        document.documentElement.clientHeight,
    });
  }

  componentDidMount() {
    this.checkOverflown();
    window.addEventListener("resize", this.checkOverflown);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkOverflown);
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
              onClickFunction={this.props.selectItem}
            />
          );
        })}
      </div>
    );
  }
}

List.defaultProps = {
  currencies: [],
  selectItem: Function.prototype,
  hideList: Function.prototype,
};
