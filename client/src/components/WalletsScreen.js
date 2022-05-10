import React, { useEffect, useState } from "react";
import './WalletsScreen.css';
import Wallet from "./Wallet";
import LoadingScreen from "./LoadingScreen";

export default function WalletsScreen(props){
    const [wallets, setWallets] = useState([]);
    const [isLoading, setLoading] = useState(true);
    useEffect( () => {
        fetch('http://localhost:3000/wallets')
        .then(response => response.json())
        .then(data => 
            {
                console.log(data);
                setWallets(data);
                setLoading(false);
                props.setHeading("Wallets");
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