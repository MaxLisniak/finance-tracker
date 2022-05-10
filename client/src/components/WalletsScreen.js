import React, { useEffect, useState } from "react";
import './WalletsScreen.css';
import Wallet from "./Wallet";
import LoadingScreen from "./LoadingScreen";

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
    const walletList = wallets.map(wallet => {
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

    return (
      isLoading==true ? <LoadingScreen /> : 
      (
        <div className='container'>
          {walletList}
        </div>
      )
    )
}