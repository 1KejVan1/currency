import { Component } from "react";

import styles from "./list_item.module.css";

export class ListItem extends Component {
  constructor(props) {
    super();
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    this.props.onClickFunction(this.props.Abbreviation);
  }

  render() {
    return (
      <div className={styles.list_item} onClick={this.handleOnClick}>
        <div className={styles.abbreviation}>{this.props.Abbreviation}</div>
        <div className={styles.cur_name}>{this.props.CurName}</div>
      </div>
    );
  }
}

ListItem.defaultProps = { onClickFunction: Function.prototype };
