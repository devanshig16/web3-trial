'use client';

import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ethers } from 'ethers';
import abi from '../../lib/abi/UserDB.json'; // Your smart contract ABI

const CONTRACT_ADDRESS = '0x25D80E4E758a395b3aE9e32644542530Cc1F176E';

export default function CandidateDashboard() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBids() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      try {
        const candidateBids = await contract.getBids(address);
        setBids(candidateBids);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    }

    fetchBids();
  }, []);

  const acceptBid = async (company) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    try {
      await contract.acceptBid(company);
      alert('Bid accepted!');
      setBids((prevBids) => prevBids.filter((bid) => bid.company !== company));
    } catch (error) {
      console.error('Error accepting bid:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Bids</h2>
      {loading ? (
        <p>Loading bids...</p>
      ) : bids.length === 0 ? (
        <p>No bids yet.</p>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div key={bid.company} className="p-4 border rounded-lg shadow-sm space-y-2">
              <p><strong>Company:</strong> {bid.company}</p>
              <p><strong>Salary:</strong> {bid.salary}</p>
              <p><strong>Job Description:</strong> {bid.jobDescription}</p>
              <button
                onClick={() => acceptBid(bid.company)}
                className="bg-blue-600 text-white px-6 py-3 rounded-full"
              >
                Accept Bid
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
