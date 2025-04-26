import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'HireNet – Web3 Hiring Platform',
  description: 'Connect wallet and access personalized dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
