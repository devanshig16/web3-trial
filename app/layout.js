import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'HireNet – Web3 Hiring Platform',
  description: 'Connect wallet and access personalized dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-[#0f172a] via-[#2e1065] to-[#0f172a] text-white min-h-screen font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
