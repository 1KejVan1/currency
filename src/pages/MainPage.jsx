import { Component } from "react";
import styles from "./page.module.css";
import { TextInput } from "../components/TextInputs/TextInput";
import { CurrencyBlock } from "../components/Currency Block/CurrencyBlock";
import { Button } from "../components/Buttons/Default/Button";
import { DeleteButton } from "../components/Buttons/Delete/DeleteButton";

export class MainPage extends Component{

    constructor(props){
        super(props);

    }

    render(){
        return <div className={styles.container}>
            <div className={styles.convertor_container}>
                <CurrencyBlock/>
            </div>
        </div>
    }
}