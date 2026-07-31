
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, FileText, Upload, Calendar, Bell, Settings, Users, Clipboard, PlusSquare } from 'lucide-react';

export default function DashboardSidebar({ role }: { role: string }) {
    const pathname = usePathname();
    
    const patientLinks = [
        { name: 'Dashboard', href: '/patient', icon: Home },
        { name: 'Profile', href: '/patient/profile', icon: User },
        { name: 'Medical History', href: '/patient/history', icon: FileText },
        { name: 'Upload Center', href: '/patient/upload', icon: Upload },
        { name: 'Reports', href: '/patient/reports', icon: Clipboard },
        { name: 'Appointments', href: '/patient/appointments', icon: Calendar },
        { name: 'Notifications', href: '/patient/notifications', icon: Bell },
        { name: 'Settings', href: '/patient/settings', icon: Settings },
    ];

    const doctorLinks = [
        { name: 'Dashboard', href: '/doctor', icon: Home },
        { name: 'Profile', href: '/doctor/profile', icon: User },
        { name: 'Patients', href: '/doctor/patients', icon: Users },
        { name: 'Reports', href: '/doctor/reports', icon: Clipboard },
        { name: 'Clinical Notes', href: '/doctor/notes', icon: FileText },
        { name: 'Prescriptions', href: '/doctor/prescriptions', icon: PlusSquare },
        { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
        { name: 'Notifications', href: '/doctor/notifications', icon: Bell },
    ];

    const links = role === 'DOCTOR' ? doctorLinks : patientLinks;

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col hidden md:flex">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-blue-600">VitaScan AI</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.name} href={link.href} 
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <Icon size={20} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
