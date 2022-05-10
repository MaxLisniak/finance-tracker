import React, { useEffect, useState } from "react";
import './App.css';
import Wallet from './components/Wallet';
import WalletView from "./components/WalletView";
import WalletsScreen from "./components/WalletsScreen";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  // const [wallets, setWallets] = useState([]);
  // const [isLoading, setLoading] = useState(true);
  const [isViewing, setViewing] = useState({status:false, id: undefined});
  const [heading, setHeading] = useState("My Wallet");
  const [transactionPerforming, performTransaction] = useState(null);
  // useEffect( () => {
  //     fetch('http://localhost:3000/wallets')
  //     .then(response => response.json())
  //     .then(data => 
  //         {
  //             console.log(data);
  //             setWallets(data);
  //             setLoading(false);
  //         }
  //     )
  // }, []);

  // const walletList = wallets.map(wallet => {
  //   return (
  //     <Wallet 
  //       name={wallet.name} 
  //       id={wallet._id} 
  //       key={wallet._id} 
  //       balance={wallet.balance} 
  //       type={wallet.type}
  //       viewWallet={viewWallet}
  //     />
  //   )
  // });


  function viewWallet(id){
    setViewing({status: true, id: id});
  }
  function stopViewingWallet(){
    setViewing({status: false, id: undefined});
  }

  return (
    <div className="body">
      <div className="navbar">
        <h1 className='navbar-header'>{heading}</h1>
      </div>
      
        {
          isViewing.status==true ? 
          <WalletView 
            id={isViewing.id} 
            setHeading={setHeading} 
            viewWallet={viewWallet} 
            stopViewingWallet={stopViewingWallet} 
            performTransaction={performTransaction}
            transactionPerforming={transactionPerforming}
          /> :
          <WalletsScreen 
            viewWallet={viewWallet} 
            setHeading={setHeading}
            performTransaction={performTransaction}  
              
          />
        }

    </div>
    // isLoading==true ? <LoadingScreen /> : 
    
  )
}

export default App;
