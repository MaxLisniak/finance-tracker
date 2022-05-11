import React, { useEffect, useState } from "react";
import './WalletsScreen.css';
import Wallet from "./Wallet";
import LoadingScreen from "./LoadingScreen";
import AddWalletButton from "./AddWalletButton";

export default function WalletsScreen(props){
    const [isLoading, setLoading] = useState(true);
    const [wallets, setWallets] = useState([]);
    useEffect( () => {
        fetch('http://localhost:3000/wallets')
        .then(response => response.json())
        .then(data => 
            {
                console.log(data);
                setWallets(data);
                setLoading(false);
                props.setHeading("My Wallet");
            }
        )
    }, []);
    let walletList = wallets.map(wallet => {
        return (
          <Wallet 
            name={wallet.name} 
            id={wallet._id} 
            key={wallet._id} 
            balance={wallet.balance} 
            type={wallet.type}
            viewWallet={props.viewWallet}
            performTransaction={props.performTransaction}
          />
        )
      });
    
      const [isAddingWallet, setAddingWallet] = useState(false);
      const [addWalletForm, setAddWalletForm] = useState({
        name: "",
        type: "Cash",
        });


      const addWalletTemplate = (
        <div className='container flex-column'>
            <button className="button-home" onClick={handleClick}>back</button>
            <form id="add-wallet-form" onSubmit={handleAddWalletSubmit}>
                <div className="input-block">
                    <label id="wallet-name-label" htmlFor="wallet-name">Wallet name</label>
                    <input 
                        type="text" 
                        id="wallet-name" 
                        placeholder="Wallet name" 
                        name="name" 
                        onChange={(e)=> updateAddWalletForm({name: e.target.value})}
                    />
                </div>
                <div className="input-block">
                    <label 
                        id="wallet-type-cash-label" 
                        htmlFor="wallet-type-cash"
                    >Cash</label>
                    <input 
                        type="radio" 
                        id="wallet-type-cash" 
                        checked={addWalletForm.type==="Cash"} 
                        value="Cash" 
                        onChange={(e)=> updateAddWalletForm({type: e.target.value})}     
                    />
                </div>
                <div className="input-block">
                    <label 
                        id="wallet-type-card-label" 
                        htmlFor="wallet-type-card"
                    >Card</label>
                    <input 
                        type="radio" 
                        id="wallet-type-card" 
                        checked={addWalletForm.type==="Card"} 
                        value="Card" 
                        onChange={(e)=> updateAddWalletForm({type: e.target.value})} 
                    />
                </div>
                <input type="submit" value="Add new wallet" />
            </form>
        </div>
    )

    function handleClick(){
        setAddingWallet(false);
    }
    
    function updateAddWalletForm(value) {
        return setAddWalletForm((prev) => {
            return { ...prev, ...value };
        });
    }
   

    async function handleAddWalletSubmit(e) {
        e.preventDefault();
      
        // When a post request is sent to the create url, we'll add a new record to the database.
        let newWallet = {  };
        newWallet.name = addWalletForm.name;
        newWallet.type = addWalletForm.type;

        await fetch("http://localhost:3000/wallets/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newWallet),
          })
          .catch(error => {
            window.alert(error);
            return;
          });
        
        setAddWalletForm({ 
            name: "", 
            type: "Cash", 
        });

        setAddingWallet(false);
    }

    return (
      isLoading==true ? <LoadingScreen /> : 
      isAddingWallet==true ? addWalletTemplate :
      (
        <div className='container'>
          {walletList}
          <AddWalletButton setAddingWallet={setAddingWallet} />
        </div>
      )
    )
}