import { Component } from "react";
import styles from "./block.module.css";
import { TextInput } from "../TextInputs/TextInput";
import { DeleteButton } from "../Buttons/Delete/DeleteButton";

export class CurrencyBlock extends Component{

    constructor(props){
        super(props);
    }

    render(){
       return  <div className={styles.block}>
       <div>USD</div>
       <TextInput/>
       <DeleteButton/>
   </div>
    }
}