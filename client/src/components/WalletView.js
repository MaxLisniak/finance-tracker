import React, { useEffect, useState } from "react";
import './WalletView.css'
import LoadingScreen from "./LoadingScreen";
import Wallet from "./Wallet";
import TransactionList from "./TransactionList";

export default function WalletView(props){
    const [transactions, setTransactions] = useState({
        incoming: [],
        outgoing: [],
    });
    const [wallet, setWallet] = useState({});
    const [isLoading, setLoading] = useState(true);

    useEffect( () => {
        fetch('http://localhost:3000/wallets/wallet/' + props.id)
        .then(response => response.json())
        .then(data => 
            {
                console.log(data);
                setWallet(data.wallet);
                setTransactions({
                    incoming: data.incoming_transactions,
                    outgoing: data.outgoing_transactions,
                })
                setLoading(false);
                props.setHeading(data.wallet.name)
            }
        )
    }, []);

    return (
        isLoading==true ? <LoadingScreen /> :
        (
            <div className='container flex-column'>
                <Wallet 
                    name={wallet.name} 
                    id={wallet._id} 
                    key={wallet._id} 
                    balance={wallet.balance} 
                    type={wallet.type}
                    viewWallet={props.viewWallet}
                    
                />
                <TransactionList heading="Incoming" transactions={transactions.incoming} />
                <TransactionList heading="Outgoing" transactions={transactions.outgoing} />

            </div>
        )
    )
    
}