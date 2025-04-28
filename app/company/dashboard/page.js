'use client';

import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';  // Ensure this points to your Firebase setup
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Link from 'next/link';
import CompanyNavbar from '../../components/CompanyNavbar';  // Import CompanyNavbar here

export default function CompanyDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState({}); // State to store dynamic bid and message inputs

  useEffect(() => {
    async function fetchCandidates() {
      const snapshot = await getDocs(collection(db, 'candidates'));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCandidates(list);
      setLoading(false);
    }

    fetchCandidates();
  }, []);

  // Handle input changes for bid amount and message dynamically for each candidate
  const handleInputChange = (e, candidateId) => {
    setBids({
      ...bids,
      [candidateId]: {
        ...bids[candidateId],
        [e.target.name]: e.target.value,
      },
    });
  };

  // Handle placing a bid on a candidate
  const placeBid = async (candidateId) => {
    try {
      const bidData = {
        companyId: 'YOUR_COMPANY_ID', // Replace with the actual company ID logic (e.g., company address)
        candidateId: candidateId,
        bidAmount: bids[candidateId]?.bidAmount || '', // Get the bid amount for the specific candidate
        status: 'pending', // You can also update this later (accepted/rejected)
        timestamp: new Date(),
        message: bids[candidateId]?.message || "We think you're a great fit!", // Get the message for the specific candidate
      };

      await addDoc(collection(db, 'bids'), bidData);
      alert('Bid placed successfully!');
    } catch (error) {
      console.error("Error placing bid: ", error);
      alert('Error placing bid. Please try again.');
    }
  };

  return (
    <div className=" min-h-screen">
      <CompanyNavbar /> {/* Add CompanyNavbar here */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Browse Candidates</h2>
        {loading ? (
          <p className="text-center text-gray-600">Loading candidates...</p>
        ) : candidates.length === 0 ? (
          <p className="text-center text-gray-500">No candidates available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="p-6 border rounded-lg shadow-md bg-white space-y-4">
                <h3 className="text-2xl font-semibold text-blue-700">{candidate.name}</h3>
                <p className="text-gray-700"><strong>Skills:</strong> {candidate.skills}</p>
                <p className="text-gray-700"><strong>Location:</strong> {candidate.location}</p>
                <p className="text-gray-700"><strong>Bio:</strong> {candidate.bio}</p>
                
                {/* Bid input and message */}
                <div className="space-y-4">
                  <input
                    type="number"
                    name="bidAmount"
                    placeholder="Bid amount (ETH)"
                    value={bids[candidate.id]?.bidAmount || ''}
                    onChange={(e) => handleInputChange(e, candidate.id)}
                    className="w-full border border-gray-300 rounded-lg text-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    name="message"
                    placeholder="Enter a message"
                    value={bids[candidate.id]?.message || ''}
                    onChange={(e) => handleInputChange(e, candidate.id)}
                    className="w-full border border-gray-300 rounded-lg text-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={() => placeBid(candidate.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Place a Bid
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
