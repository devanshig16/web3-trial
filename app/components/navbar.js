'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ethers } from 'ethers';

export default function Navbar() {
  const pathname = usePathname();
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function detectRole() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const userAddress = await signer.getAddress();

          // Check if address exists in candidates
          const candidateDoc = await getDoc(doc(db, 'candidates', userAddress));
          if (candidateDoc.exists()) {
            setRole('candidate');
            return;
          }

          // Check if address exists in companies
          const companyDoc = await getDoc(doc(db, 'companies', userAddress));
          if (companyDoc.exists()) {
            setRole('company');
            return;
          }

          setRole(null); // no role assigned
        } catch (error) {
          console.error('Failed to detect user role:', error);
        }
      }
    }

    detectRole();
  }, []);

  const navItems = {
    candidate: [
      { label: 'My Profile', href: '/candidate/profile' },
      { label: 'Browse Candidates', href: '/candidate' },
    ],
    company: [
      { label: 'My Company Profile', href: '/company/profile' },
      { label: 'Browse Companies', href: '/company' },
      { label: 'candidates', href: '/company/dashboard'}
    ],
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold text-black">Website name</h1>
      </div>
      <div className="space-x-4">
        {role && navItems[role].map(({ label, href }) => (
          <Link key={href} href={href}>
            <span
              className={`hover:underline ${
                'text-black'
              }`}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
