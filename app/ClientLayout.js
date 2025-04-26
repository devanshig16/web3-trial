'use client';

import { usePathname } from 'next/navigation';
import Navbar from './components/navbar';

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  return (
    <>
      {/* Only render Navbar if we are NOT on the homepage */}
      {pathname !== '/' && <Navbar />}
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </>
  );
}
