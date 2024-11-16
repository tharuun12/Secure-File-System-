import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        setContract(contract);
        setProvider(provider);
      } catch (error) {
        console.error("Error loading provider:", error);
      }
    };

    loadProvider();

    // Cleanup function
    return () => {
      if (provider) {
        provider.removeAllListeners(); // Remove all event listeners
      }
    };
  }, [provider]); // Add 'provider' to the dependency array

  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}

      <div className="App">
        <h1 style={{ color: "white" }}>Secure Drive</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account ID : {account ? account : "Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        />
        <Display contract={contract} account={account} />
      </div>
    </>
  );
}

export default App;
