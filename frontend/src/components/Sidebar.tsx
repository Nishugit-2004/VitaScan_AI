import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-full p-4 hidden md:block">
      <ul className="space-y-4 text-gray-700">
  <li className="font-semibold text-blue-600 hover:text-blue-800">
    <Link href="/dashboard">Dashboard</Link>
  </li>

  <li className="hover:text-blue-600 cursor-pointer">
    <Link href="/dashboard/new-scan">New Scan</Link>
  </li>

  <li className="hover:text-blue-600 cursor-pointer">
    <Link href="/dashboard/reports">Reports</Link>
  </li>

  <li className="hover:text-blue-600 cursor-pointer">
    <Link href="/dashboard/appointments">Appointments</Link>
  </li>

  <li className="hover:text-blue-600 cursor-pointer">
    <Link href="/dashboard/profile">Profile</Link>
  </li>
</ul>
    </aside>
  );
}
