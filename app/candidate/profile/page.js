'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ethers } from 'ethers';
import abi from '../../abi/CandidateProfileDB.json';
import CandidateNavbar from '../../components/CandidateNavbar';  // Adjust the path if needed

const CONTRACT_ADDRESS = '0x50e24454759fe703483d09c6f239c1ca0c5ba279';

export default function CandidateProfile() {
  const [form, setForm] = useState({ username: '', age: '', skills: '', bio: '', resume: '' });
  const [address, setAddress] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function init() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const userAddress = await signer.getAddress();
          setAddress(userAddress);

          const docRef = doc(db, 'candidates', userAddress);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setForm(docSnap.data());
          }
        } catch (error) {
          console.error('Error connecting to Metamask:', error);
          alert('Please connect to Metamask.');
        }
      } else {
        alert('Metamask not found.');
      }
    }

    init();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!address) {
      alert('Wallet address not detected.');
      return;
    }

    try {
      const docRef = doc(db, 'candidates', address);
      await setDoc(docRef, form);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const firebaseUrl = `https://firestore.googleapis.com/v1/projects/decent-hiring/databases/(default)/documents/${docRef.path}`;
      const tx = await contract.setProfileURL(firebaseUrl);
      await tx.wait();

      alert('Profile saved successfully!');
      router.push('/candidate');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile.');
    }
  };

  return (
    <div>
      <CandidateNavbar /> {/* Add Candidate Navbar here */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6 mt-10">
        <h2 className="text-3xl font-bold text-center text-blue-600">Candidate Profile</h2>
        
        {['username', 'age', 'skills', 'bio', 'resume'].map(field => (
          field === 'bio' || field === 'resume' ? (
            <textarea
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={field === 'bio' ? 4 : 6}
            />
          ) : (
            <input
              key={field}
              type={field === 'age' ? 'number' : 'text'}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )
        ))}

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
