import React, { useState } from "react";
import './App.css';
import WalletView from "./components/WalletView";
import WalletsScreen from "./components/WalletsScreen";

function App() {
  const [isViewing, setViewing] = useState({status:false, id: undefined});
  const [heading, setHeading] = useState("My Wallet");
  const [transactionPerforming, performTransaction] = useState(null);


  function viewWallet(id){
    setViewing({status: true, id: id});
  }
  function stopViewingWallet(){
    setViewing({status: false, id: undefined});
    performTransaction(null);
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
    
  )
}

export default App;
