'use client';

import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import abi from './abi/UserDB.json';
const USERDB_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USERDB_CONTRACT_ADDRESS;

export default function Home() {
  const router = useRouter();

  async function handleConnect() {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }
  
    try {
      // This line forces the wallet connect popup
      await window.ethereum.request({ method: 'eth_requestAccounts' });
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(USERDB_CONTRACT_ADDRESS, abi, signer);
  
      const user = await contract.getUser(address);
      if (user.wallet === ethers.constants.AddressZero) {
        router.push('/register');
      } else {
        router.push(user.role === 0 ? '/candidate' : '/company');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      alert('Error connecting to blockchain.');
      router.push('/register');
    }
  }
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 relative overflow-hidden font-special">
      {/* Animated overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 opacity-50 animate-gradient-slow z-0"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 animate-text">
          HireNet
        </h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Discover talent. Empower companies. All decentralized.
        </p>
        <button
  onClick={handleConnect}
  className="bg-white text-purple-700 font-bold px-8 py-4 rounded-full hover:bg-blue-300 hover:scale-105 shadow-xl transition transform duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-700 focus-visible:ring-offset-2"
>
  Connect Wallet
</button>

      </div>
    </div>
  );
}
