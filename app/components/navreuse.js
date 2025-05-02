import Link from 'next/link';

export default function Navbar({ title, links }) {
  return (
    <nav className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex space-x-8 text-lg font-medium">
          {links.map((link, index) => (
            <Link key={index} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
