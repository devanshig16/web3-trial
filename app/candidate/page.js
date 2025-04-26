'use client';

import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function BrowseCandidates() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    async function fetchCandidates() {
      const querySnapshot = await getDocs(collection(db, 'candidates'));
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProfiles(results);
    }
    fetchCandidates();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 space-y-8">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Browse Candidates</h2>

      {profiles.length === 0 ? (
        <p className="text-center text-gray-600">No candidate profiles available.</p>
      ) : (
        profiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-lg shadow-md p-6 space-y-3">
            <h3 className="text-2xl font-semibold text-black">{profile.username}</h3>
            <p className="text-black"><span className="font-medium">Age:</span> {profile.age}</p>
            <p className="text-black"><span className="font-medium">Skills:</span> {profile.skills}</p>
            <p className="text-black"><span className="font-medium">Bio:</span> {profile.bio}</p>
            <p className="text-black"><span className="font-medium">Resume:</span> {profile.resume}</p>
          </div>
        ))
      )}
    </div>
  );
}
