import Navbar from './navreuse';

export default function CandidateNavbar() {
  const links = [
    { label: 'Browse Candidates', href: '/candidate/' },
    { label: 'My Profile', href: '/candidate/profile' },
    { label: 'Browse Companies', href: '/candidate/dashboard' },
  ];

  return <Navbar title="Candidate Dashboard" links={links} />;
}
