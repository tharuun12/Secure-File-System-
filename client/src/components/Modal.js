import React, { useState, useEffect } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const sharing = async () => {
    const address = document.querySelector(".address").value;
    await contract.allow(address);
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchAccessList = async () => {
      try {
        const addresses = await contract.shareAccess();
        setAddressList(addresses);
      } catch (error) {
        console.error("Error fetching access list:", error);
      }
    };

    if (contract) {
      fetchAccessList();
    }
  }, [contract]);

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  return (
    <>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">Share with</div>
          <div className="body">
            <input
              type="text"
              className="address"
              placeholder="Enter Address"
            />
          </div>
          <form id="myForm">
            <select
              id="selectNumber"
              value={selectedAddress}
              onChange={handleAddressChange}
            >
              <option className="address">People With Access</option>
              {addressList.map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))}
            </select>
          </form>
          <div className="footer">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={sharing}>Share</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
