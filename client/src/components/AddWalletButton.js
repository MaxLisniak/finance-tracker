import React from "react";
import "./AddWalletButton.css";

export default function AddWalletButton(props){
    return (
        <div onClick={()=>props.setAddingWallet(true)} className="add-wallet-button">
            <p className="plus">+</p>
        </div>
    )
}