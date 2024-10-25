import { Component } from "react";
import { Button } from "../Default/Button";
import icon from "../../../assets/close.png"
import styles from "./delete.module.css";

export class DeleteButton extends Component{
    constructor(props){
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick(){
        onClickFunction();
    }

    render(){
        return <Button onClickFunction={this.handleOnClick} className={styles.delete_button}>
            <img className={styles.img} src={icon}/>
        </Button>
    }
}

DeleteButton.defaultProps = {onClickFunction: Function.prototype}