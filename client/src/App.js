import React from 'react';
import './App.css';
import Wallet from './components/Wallet';

function App() {
  return (
    <div class="body">
      <div className="navbar">
      <h1 className='navbar-header'>WALLETS</h1>
    </div>
    <div className='container'>
      <Wallet name="EARNED" balance={50}></Wallet>
      <Wallet name="SENT" balance={50}></Wallet>
      <Wallet name="Personal" balance={50}></Wallet>
    </div>
    </div>
  );
}

export default App;
