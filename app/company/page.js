'use client';

import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import CompanyNavbar from '../components/CompanyNavbar';  // Import CompanyNavbar here

export default function BrowseCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      const snapshot = await getDocs(collection(db, 'companies'));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompanies(list);
      setLoading(false);
    }

    fetchCompanies();
  }, []);

  return (
    <div>
      <CompanyNavbar /> {/* Add CompanyNavbar here */}
      <div className="w-full px-4 py-8"> {/* Change from max-w-6xl to w-full */}
        <h2 className="text-3xl font-bold mb-6 text-center text-white ">Browse Companies</h2>
        {loading ? (
          <p className="text-center text-black">Loading companies...</p>
        ) : companies.length === 0 ? (
          <p className="text-center text-black-500">No companies listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company.id} className="p-4 border rounded-lg shadow-sm bg-white text-black space-y-2">
                <h3 className="text-xl font-semibold text-black">{company.name}</h3>
                <p className="text-black"><strong>Industry:</strong> {company.industry}</p>
                <p className="text-black"><strong>Location:</strong> {company.location}</p>
                <p className="text-black"><strong>Team Size:</strong> {company.teamSize}</p>
                <p className="text-black"><strong>Mission:</strong> {company.mission}</p>
                <p className="text-black"><strong>Bio:</strong> {company.bio}</p>
                <p className="text-black"><strong>Hiring For:</strong> {company.hiringFor}</p>
                <p className="text-black"><strong>Perks:</strong> {company.perks}</p>
                <p className="text-black">
                  <strong>Website:</strong>{' '}
                  <a href={company.website} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                    {company.website}
                  </a>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
