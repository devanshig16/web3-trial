'use client';

import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import CandidateNavbar from '../../components/CandidateNavbar';  // Adjust the path if needed

export default function CandidateDashboard() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBids() {
      // Get all bids
      const bidSnapshot = await getDocs(collection(db, 'bids'));
      const bidList = bidSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBids(bidList);
      setLoading(false);
    }

    fetchBids();
  }, []);

  const handleBidResponse = async (bidId, status) => {
    try {
      // Update the bid status (accepted or rejected)
      const bidRef = doc(db, 'bids', bidId);
      await updateDoc(bidRef, { status });
      alert(`Bid ${status} successfully!`);
    } catch (error) {
      console.error("Error updating bid status: ", error);
      alert('Error updating bid status.');
    }
  };

  return (
    <div>
      <CandidateNavbar /> {/* Add Candidate Navbar here */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Bids</h2>
        {loading ? (
          <p className="text-center">Loading bids...</p>
        ) : bids.length === 0 ? (
          <p className="text-center text-gray-500">No bids received yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bids.map((bid) => (
              <div key={bid.id} className="p-4 border rounded-lg shadow-sm bg-white space-y-2">
                <p><strong>Bid Amount:</strong> {bid.bidAmount}</p>
                <p><strong>Message:</strong> {bid.message}</p>

                {/* Accept and Reject buttons */}
                <button
                  onClick={() => handleBidResponse(bid.id, 'accepted')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                >
                  Accept Bid
                </button>
                <button
                  onClick={() => handleBidResponse(bid.id, 'rejected')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                >
                  Reject Bid
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
