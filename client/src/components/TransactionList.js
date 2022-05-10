import "./TransactionList.css";
import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

export default function TransactionList(props){
    const TransactionList = props.transactions.map(transaction => {
        const sign = props.heading === "Incoming" ? "+" : 
        props.heading === "Outgoing" ? "-" : "";
        const transactionClassName = 
        props.heading === "Incoming" ? "incoming-transaction transaction" : 
        props.heading === "Outgoing" ? "outgoing-transaction transaction" : "transaction";
        const datetime_formated = transaction.datetime ? 
        DateTime.fromISO(transaction.datetime)
        .toLocaleString(DateTime.DATETIME_MED) : 
        '';
        return (
        <li key={transaction._id} className={transactionClassName}>
            <p className="transaction-amount">{sign} {transaction.amount}</p>
            <p className="transaction-description">"{transaction.description}"</p>
            <p className="transaction-from">{
                transaction.from.name !== undefined ? 
                "from " + transaction.from.name : ""
                }</p>
            <p className="transaction-to">{
                transaction.to.name !== undefined ? 
                "to " + transaction.to.name : ""
                }</p>
            <p className="transaction-category">{
                transaction.category !==undefined ? transaction.category.name : ""
                }</p>
            <p className="transaction-date" >{datetime_formated}</p>
        </li>
        )
    })
    console.log(props.transactions);
    return (
        <div className="transactions-container">

            <h2>{props.heading}</h2>
            <ul className="transactions-list">
                {props.transactions.length === 0 ? 
                <p>No transactions</p> : TransactionList }
            </ul>
        </div>
    )
}