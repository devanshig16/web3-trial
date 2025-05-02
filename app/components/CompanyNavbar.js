import Navbar from './navreuse';

export default function CompanyNavbar() {
  const links = [
    { label: 'Browse Candidates', href: '/company/dashboard' },
    { label: 'My Profile', href: '/company/profile' },
    { label: 'Browse Companies', href: '/company' },
  ];

  return <Navbar title="Company Dashboard" links={links} />;
}
