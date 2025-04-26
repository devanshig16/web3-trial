'use client';

import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';

export default function CompanyDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidates() {
      const snapshot = await getDocs(collection(db, 'candidates'));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCandidates(list);
      setLoading(false);
    }

    fetchCandidates();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Browse Candidates</h2>
      {loading ? (
        <p className="text-center">Loading candidates...</p>
      ) : candidates.length === 0 ? (
        <p className="text-center text-gray-500">No candidates available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="p-4 border rounded-lg shadow-sm bg-white space-y-2">
              <h3 className="text-xl font-semibold text-blue-700">{candidate.name}</h3>
              <p><strong>Skills:</strong> {candidate.skills}</p>
              <p><strong>Location:</strong> {candidate.location}</p>
              <p><strong>Bio:</strong> {candidate.bio}</p>
              <Link href={`/company/bid/${candidate.id}`} className="text-blue-600 hover:underline">
                Place a Bid
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
