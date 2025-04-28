import Link from 'next/link';

export default function CompanyNavbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3">
      <div className="max-w-full mx-auto flex flex-wrap justify-between items-center px-6">
        <Link href="/company/dashboard" className="text-2xl font-bold tracking-wide hover:underline">
          Company Dashboard
        </Link>
        <div className="flex space-x-6 text-lg font-medium">
          <Link href="/company/profile" className="hover:underline">
            Profile
          </Link>
          <Link href="/candidate/dashboard" className="hover:underline">
            Browse Candidates
          </Link>
          <Link href="/company" className="hover:underline">
            Browse Companies
          </Link>
        </div>
      </div>
    </nav>
  );
}
