'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import abi from '../abi/UserDB.json';

const CONTRACT_ADDRESS = '0x25D80E4E758a395b3aE9e32644542530Cc1F176E';

export default function RegisterPage() {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  async function register(role) {
    if (!window.ethereum) return alert('MetaMask not found');

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    try {
      const tx = await contract.registerUser(role);
      await tx.wait();
      router.push(role === 0 ? '/candidate' : '/company');
    } catch (err) {
      console.error('Registration error:', err);
      alert('Transaction failed');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 space-y-10">
      <h1 className="text-4xl font-bold text-gray-800">Register Your Role</h1>
      <p className="text-lg text-gray-600">Choose how you want to use the platform.</p>
      <div className="flex gap-10">
        <button
          onClick={() => register(0)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow transition"
        >
          Register as Candidate
        </button>
        <button
          onClick={() => register(1)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow transition"
        >
          Register as Company
        </button>
      </div>
    </div>
  );
}
