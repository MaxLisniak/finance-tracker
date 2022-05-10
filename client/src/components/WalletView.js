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
    const [form, setForm] = useState({
        amount: 0,
        description: "",
        category: undefined,
        target_wallet: undefined,
    });
    const [categories, setCategories] = useState([]);
    function handleClick(){
        props.stopViewingWallet();
    }
    const [wallets, setWallets] = useState([]);

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

                if (props.transactionPerforming === "Move"){
                    console.log(wallet);
                    const url = 'http://localhost:3000/wallets/accessible/' + data.wallet._id;
                    fetch(url)
                    .then(response => response.json())
                    .then(data => 
                        {
                            setWallets(data);
                            updateForm({target_wallet: data[0]._id})
                        }
                    )
                }
            }
        );
        if (props.transactionPerforming === "Spend"){
            fetch('http://localhost:3000/wallets/transaction_categories/')
            .then(response => response.json())
            .then(data => 
                {
                    setCategories(data); 
                    updateForm({category: data[0]._id})
                }
            );
        }
        
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
      
        // When a post request is sent to the create url, we'll add a new record to the database.
        let newTransaction = {  };
        newTransaction.amount = form.amount;
        newTransaction.description = form.description;
        if (form.category !== undefined) {newTransaction.category = form.category};
        if (form.target_wallet !== undefined) {newTransaction.target_wallet = form.target_wallet};


        console.log(newTransaction)
        let url = 'http://localhost:3000/wallets/';
        if (props.transactionPerforming === "Add") {url = url + 'add_to/' + wallet._id}
        else if (props.transactionPerforming === "Spend") {url = url + 'spend_from/' + wallet._id}
        else if (props.transactionPerforming === "Move") {url = url + 'move_from/' + wallet._id}
        else return;
      
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTransaction),
        })
        .catch(error => {
          window.alert(error);
          return;
        });
      
        setForm({ 
            description: "", 
            amount: 0, 
            category: undefined, 
            target_wallet: undefined
        });
        props.performTransaction(null);
        props.stopViewingWallet();
    }

    function updateForm(value) {
    return setForm((prev) => {
        return { ...prev, ...value };
    });
    }

    const categoryList = categories.map(category => {
        return (
            <option value={category._id} key={category._id}>{category.name}</option>
        )
    })

    const walletList = wallets.map(item => {
        return (
            <option value={item._id} key={item._id}>{item.name} ({item.balance})</option>
        )
    })

    const viewingTemplate = (
        <div className='container flex-column'>
            <button className="button-home" onClick={handleClick}>back</button>
            <Wallet 
                name={wallet.name} 
                id={wallet._id} 
                key={wallet._id} 
                balance={wallet.balance} 
                type={wallet.type}
                viewWallet={props.viewWallet}
                performTransaction={props.performTransaction}
                
            />
            <TransactionList heading="Incoming" transactions={transactions.incoming} />
            <TransactionList heading="Outgoing" transactions={transactions.outgoing} />

        </div>
    );

    const makeTransactionTemplate = (
        <div className='container flex-column'>
            <button className="button-home" onClick={handleClick}>back</button>
            <form onSubmit={handleSubmit}>
                <label htmlFor="transaction-amount">Amount</label>
                <input 
                    id="transaction-amount"
                    type="number"
                    placeholder="Enter amount"
                    name="amount"
                    required="required" 
                    onChange={(e) => updateForm({ amount: e.target.value })}
                />
                <label htmlFor="transaction-description">Description</label>
                <input 
                    id="transaction-description"
                    type="text"
                    placeholder="Enter description"
                    name="description"
                    onChange={(e) => updateForm({ description: e.target.value })}

                />
                {props.transactionPerforming === "Spend" ?
                (
                    <select name="category" onChange={(e) => updateForm({ category: e.target.value })}>
                    {categoryList }
                    </select>
                    
                ) : ""
                }
                {props.transactionPerforming === "Move" ?
                (
                    <select name="target_wallet" onChange={(e) => updateForm({ target_wallet: e.target.value })}>
                    {walletList }
                    </select>
                    
                ) : ""
                }

                <input
                    type="submit"
                    value={props.transactionPerforming}
                />
            </form>
        </div>
    )

    return (
            isLoading==true ? <LoadingScreen /> :
            props.transactionPerforming === null ?
            viewingTemplate :
            makeTransactionTemplate 
    )
    
}