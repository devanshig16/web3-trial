'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ethers } from 'ethers';
import abi from '../../abi/CompanyProfileDB.json';
import CompanyNavbar from '../../components/CompanyNavbar';  // Import CompanyNavbar here

const CONTRACT_ADDRESS = '0x2ed363230d00f1d30b2129e5a72af6c7ecb82a38';

export default function CompanyProfile() {
  const [form, setForm] = useState({
    name: '',
    industry: '',
    website: '',
    location: '',
    teamSize: '',
    bio: '',
    mission: '',
    hiringFor: '',
    perks: '',
  });
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false); // Added saving state
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        setAddress(addr);

        const docSnap = await getDoc(doc(db, 'companies', addr));
        if (docSnap.exists()) setForm(docSnap.data());
      } catch (err) {
        console.error(err);
      }
    }

    if (window.ethereum) init();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      setSaving(true); // Set loading state when starting submission

      const docRef = doc(db, 'companies', address);
      await setDoc(docRef, form);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const firebaseUrl = `https://firestore.googleapis.com/v1/projects/decent-hiring/databases/(default)/documents/${docRef.path}`;

      const tx = await contract.setProfileURL(firebaseUrl);
      await tx.wait();

      alert('Company profile saved successfully!');
      router.push('/company');
    } catch (error) {
      console.error('Error saving company profile:', error);
      alert('Failed to save company profile. Please try again.');
    } finally {
      setSaving(false); // Reset saving state after submission (success/fail)
    }
  };

  return (
    <div>
      <CompanyNavbar /> {/* Add CompanyNavbar here */}
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-2xl font-bold text-black mb-4">Edit Company Profile</h2>
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (s) => s.toUpperCase())}
            value={value}
            onChange={handleChange}
            className="w-full border border-gray-300 text-black rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
        <button
          onClick={handleSubmit}
          className="w-full bg-pink-500 hover:bg-pink-400 text-white font-semibold py-2 px-4 rounded"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
