'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import abi from './abi/UserDB.json';

const CONTRACT_ADDRESS = '0x25D80E4E758a395b3aE9e32644542530Cc1F176E';

export default function Home() {
  const router = useRouter();

  async function handleConnect() {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    try {
      const user = await contract.getUser(address);
      if (user.wallet === ethers.constants.AddressZero) {
        router.push('/register');
      } else {
        router.push(user.role === 0 ? '/candidate' : '/company');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      router.push('/register');
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#1e3c72] to-[#2a5298] text-white px-6">
      <h1 className="text-5xl font-bold mb-4 text-center">HireNet</h1>
      <p className="text-lg mb-8 max-w-xl text-center">
        Discover talent. Empower companies. All decentralized.
      </p>
      <button
        onClick={handleConnect}
        className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 shadow-lg transition duration-300"
      >
        Connect Wallet
      </button>
    </div>
  );
}
