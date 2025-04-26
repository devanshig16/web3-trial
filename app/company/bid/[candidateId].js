'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ethers } from 'ethers';
import abi from '../../abi/UserDB.json'; // Your smart contract ABI

const CONTRACT_ADDRESS = '0x25D80E4E758a395b3aE9e32644542530Cc1F176E';

export default function BidPage() {
  const router = useRouter();
  const { candidateId } = router.query;
  const [candidate, setCandidate] = useState(null);
  const [salary, setSalary] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    async function fetchCandidate() {
      const docRef = doc(db, 'candidates', candidateId);
      const candidateDoc = await getDoc(docRef);
      if (candidateDoc.exists()) {
        setCandidate(candidateDoc.data());
      }
    }

    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);

  const handleBid = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    try {
      // Call the smart contract's placeBid function
      await contract.placeBid(candidateId, salary, jobDescription);
      alert('Bid placed successfully!');
      router.push('/company/dashboard');
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {candidate ? (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-center">Place a Bid on {candidate.name}</h2>
          <div>
            <p><strong>Skills:</strong> {candidate.skills}</p>
            <p><strong>Location:</strong> {candidate.location}</p>
            <p><strong>Bio:</strong> {candidate.bio}</p>
          </div>
          <div className="space-y-2">
            <label>Salary</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label>Job Description</label>
            <textarea
              className="w-full px-4 py-2 border rounded"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          <button
            onClick={handleBid}
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full"
          >
            Place Bid
          </button>
        </div>
      ) : (
        <p>Loading candidate details...</p>
      )}
    </div>
  );
}
