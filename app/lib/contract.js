import { ethers } from 'ethers';
import contractABI from '../abi/UserDB.json';

const CONTRACT_ADDRESS = '0x25D80E4E758a395b3aE9e32644542530Cc1F176E';

export const getContract = () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error("MetaMask not detected");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
};
