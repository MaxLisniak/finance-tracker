import React, { useEffect, useState } from "react";
import './Wallet.css'

export default function Wallet(props){
    let walletClassName = 
        props.type==="Cash" ? "wallet-cash": 
        props.type==="Service" ? "wallet-service" : 
        props.type==="Card" ? "wallet-card": "";
    walletClassName += " wallet";

    function handleAddClick(){
        props.performTransaction('Add');
    }
    function handleSpendClick(){
        props.performTransaction('Spend');
    }
    function handleMoveClick(){
        props.performTransaction('Move');
    }

    return (
        <div className={walletClassName} onClick={()=>props.viewWallet(props.id)}>
            <div className="wallet-name">{props.name}</div>
            <div className='wallet-balance'>balance: {props.balance}</div>
            {props.type==="Service" ? "" : (
                <div className='wallet-action-btns'>
                    <button 
                        className='wallet-action-btn'
                        onClick={handleAddClick}
                    >Add money</button>
                    <button 
                        className='wallet-action-btn'
                        onClick={handleSpendClick}
                    >Spend money</button>
                    <button 
                        className='wallet-action-btn'
                        onClick={handleMoveClick}
                    >Move money</button>
                </div>
            )}
      </div>
    );
}