import React, { useEffect, useState } from "react";
import './Wallet.css'

export default function Wallet(props){
    let walletClassName = props.type==="Cash" ? "wallet-cash": "";
    walletClassName += " wallet";
    return (
        <div className={walletClassName}>
            <div className="wallet-name">{props.name}</div>
            <div className='wallet-balance'>balance: {props.balance}</div>
            <div className='wallet-action-btns'>
                <button className='wallet-action-btn'>Add money</button>
                <button className='wallet-action-btn'>Send money</button>
                <button className='wallet-action-btn'>Move money</button>
            </div>
      </div>
    );
}