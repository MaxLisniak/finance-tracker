import React, { useEffect, useState } from "react";
import './App.css';
import Wallet from './components/Wallet';

function App() {
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
      />
    )
  })
  const loadingScreen = (
    <div className="loading-screen">
      <h2 className="loading">Loading...</h2>
    </div>
  )
  return isLoading==true ? loadingScreen : (
    <div className="body">
      <div className="navbar">
      <h1 className='navbar-header'>WALLETS</h1>
    </div>
    <div className='container'>
      {walletList}
    </div>
    </div>
  );
}

export default App;
