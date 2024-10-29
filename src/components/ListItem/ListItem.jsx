import { Component } from "react";

import styles from "./list_item.module.css";

export class ListItem extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div className={styles.list_item}>
        <div className={styles.abbreviation}>{this.props.Abbreviation}</div>
        <div className={styles.cur_name}>{this.props.CurName}</div>
      </div>
    );
  }
}
