import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from 'ethers';
import abi from "./utils/WavePortal.json";

const getRandomPersianPraise = () => {
  const map = [
    'تو رو خیلی دوست دارم',
    'تو تنہا رفیق من ھستی',
    'ھوات و دارم',
  ];
  let idx = Math.floor(Math.random() * map.length);
  return map[idx];
}


const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = '0x0d39251f75aEc9DA26bd11534fc4366c7915a44c';
  const contractABI = abi.abi;
   const [allWaves, setAllWaves] = useState([]);


  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(getRandomPersianPraise());
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        سلام چطورین؟
        </div>

        <div className="bio">
          من صیام ہستم۔ در خدمت تون یہ ایپلیکیشن رو اجرا می کنم
        </div>

        <button className="waveButton" onClick={wave}>
          سلام برسانید
        </button>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            ارتباط بہ والت قایم کنید
          </button>
        )}
        <h4 style={{ textAlign: 'center' }}>
          <span className="counter">{allWaves.length}</span>
          <span className="counter-label">مقدار سلام ھا</span>
        </h4>
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div class="message">{wave.message}</div>
              <div class="tiny">Address: {wave.address}</div>
              <div class="tiny">Time: {wave.timestamp.toString()}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App