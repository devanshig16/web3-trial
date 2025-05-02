'use client';

import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import CandidateNavbar from '../../components/CandidateNavbar';  // Adjust the path if needed

export default function CandidateDashboard() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedCompany, setAcceptedCompany] = useState(null); // Store accepted company data

  useEffect(() => {
    // Check if there's any accepted company data in localStorage
    const storedAcceptedCompany = localStorage.getItem('acceptedCompany');
    if (storedAcceptedCompany) {
      setAcceptedCompany(JSON.parse(storedAcceptedCompany));
      setLoading(false);  // Stop loading since we already have accepted company data
    } else {
      // Fetch bids if no accepted company is stored
      async function fetchBids() {
        const bidSnapshot = await getDocs(collection(db, 'bids'));
        const bidList = bidSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBids(bidList);
        setLoading(false);
      }

      fetchBids();
    }
  }, []);

  const handleBidResponse = async (bidId, status, companyId) => {
    try {
      // Update the bid status (accepted or rejected)
      const bidRef = doc(db, 'bids', bidId);
      await updateDoc(bidRef, { status });

      if (status === 'accepted') {
        // Fetch the accepted company data
        const companyRef = doc(db, 'companies', companyId);
        const companySnapshot = await getDoc(companyRef);
        if (companySnapshot.exists()) {
          const companyData = companySnapshot.data();
          console.log('Accepted company data:', companyData);  // Debug log

          // Persist the accepted company data in localStorage
          localStorage.setItem('acceptedCompany', JSON.stringify(companyData));

          setAcceptedCompany(companyData);  // Update state with company data
        }
      }

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
        {acceptedCompany ? (
          // Display accepted company's details
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Accepted Company</h2>
            <div className="bg-black p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Company Name: {acceptedCompany.name}</h3>
              <p><strong>Bio:</strong> {acceptedCompany.bio}</p>
              <p><strong>Industry:</strong> {acceptedCompany.industry}</p>
              <p><strong>Location:</strong> {acceptedCompany.location}</p>
              <p><strong>Team Size:</strong> {acceptedCompany.teamSize}</p>
              <p><strong>Mission:</strong> {acceptedCompany.mission}</p>
              <p><strong>Perks:</strong> {acceptedCompany.perks}</p>
              <p><strong>Website:</strong> <a href={acceptedCompany.website} target="_blank" rel="noopener noreferrer">{acceptedCompany.website}</a></p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Your Bids</h2>
            {loading ? (
              <p className="text-center">Loading bids...</p>
            ) : bids.length === 0 ? (
              <p className="text-center text-gray-500">No bids received yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bids.map((bid) => (
                  <div key={bid.id} className="p-4 border rounded-lg shadow-sm bg-black space-y-2">
                    <p><strong>Bid Amount:</strong> {bid.bidAmount}</p>
                    <p><strong>Message:</strong> {bid.message}</p>

                    {/* Accept and Reject buttons */}
                    <button
                      onClick={() => handleBidResponse(bid.id, 'accepted', bid.companyId)}
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
          </>
        )}
      </div>
    </div>
  );
}
