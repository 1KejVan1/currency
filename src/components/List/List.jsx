import { Component } from "react";

import classNames from "classnames";

import { DeleteButton } from "../Buttons/Delete/DeleteButton";
import { ListItem } from "../ListItem/ListItem";
import styles from "./list.module.css";

export class List extends Component {
  constructor(props) {
    super(props);
    this.state = { isOverflown: false, isMobile: false, testWidth: 500 };
    this.checkOverflown = this.checkOverflown.bind(this);
    this.checkIsMobileForClassName = this.checkIsMobileForClassName.bind(this);
    this.checkDeviceWidth = this.checkDeviceWidth.bind(this);
  }

  checkOverflown() {
    const element = document.getElementById("list");

    console.log(
      element.getBoundingClientRect().bottom,
      document.documentElement.clientHeight,
    );

    if (!this.state.isMobile) {
      this.setState({
        isOverflown:
          element.getBoundingClientRect().bottom >
          document.documentElement.clientHeight,
      });
    } else {
      this.setState({ isOverflown: false });
    }
  }

  checkDeviceWidth() {
    this.setState({
      isMobile:
        document.documentElement.getBoundingClientRect().width <=
        this.state.testWidth,
    });
  }

  componentDidMount() {
    this.checkOverflown();
    this.checkDeviceWidth();

    window.addEventListener("resize", this.checkOverflown);
    window.addEventListener("resize", this.checkDeviceWidth);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkOverflown);
    window.removeEventListener("resize", this.checkDeviceWidth);
  }

  checkIsMobileForClassName() {
    if (this.state.isMobile) {
      return false;
    } else if (this.state.isOverflown) {
      return true;
    }

    return false;
  }

  render() {
    return (
      <div
        id="list"
        className={classNames(
          this.state.isMobile ? styles.list_mobile : styles.list,
          this.checkIsMobileForClassName() && styles.list_bottom,
        )}
      >
        {this.state.isMobile && (
          <div className={styles.header_for_list_mobile}>
            <div className={styles.header_for_list_mobile_icon}>
              <DeleteButton onClickFunction={this.props.hideList} />
            </div>
            <div className={styles.header_for_list_mobile_title}>
              Список валют
            </div>
          </div>
        )}
        {this.props.currencies.map((item) => {
          return (
            <ListItem
              key={item.abbreviation}
              Abbreviation={item.abbreviation}
              CurName={item.name}
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
