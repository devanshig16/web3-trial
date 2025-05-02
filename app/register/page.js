'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import abi from '../abi/UserDB.json';

const USERDB_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USERDB_CONTRACT_ADDRESS;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function register(role) {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed!');
      return;
    }
  
    try {
      setLoading(true);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(USERDB_CONTRACT_ADDRESS, abi, signer);
  
      // Pass 1 for Candidate and 2 for Company (matching the enum values)
      const roleValue = role === 0 ? 1 : 2; // Use 1 for Candidate and 2 for Company
      const tx = await contract.registerUser(roleValue); 
      await tx.wait(); // Wait for transaction to be mined
  
      router.push(role === 0 ? '/candidate' : '/company');
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed. Please make sure you confirmed the transaction.');
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 bg-gradient-to-br from-[#dbeafe] via-[#ede9fe] to-[#dbeafe] text-gray-900 space-y-10">
      <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
        Choose Your Role
      </h1>
      <p className="text-lg text-gray-700 max-w-xl text-center">
        Are you here to find opportunities or to discover talent? Select your path below.
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        <button
          onClick={() => register(0)}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 focus-visible:ring-offset-2 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Register as Candidate'}
        </button>
        <button
          onClick={() => register(1)}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300 focus-visible:ring-offset-2 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Register as Company'}
        </button>
      </div>
    </div>
  );
}
