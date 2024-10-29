import { Component } from "react";

import { ListItem } from "../ListItem/ListItem";
import styles from "./list.module.css";

export class List extends Component {
  constructor(props) {
    super();
  }

  //   componentDidMount() {
  //     window.addEventListener("click", this.props.hideFunction);
  //   }

  //   componentWillUnmount() {
  //     window.removeEventListener("click", this.props.hideFunction);
  //   }

  render() {
    return (
      <div className={styles.list}>
        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />
      </div>
    );
  }
}
