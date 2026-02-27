import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  UserPlus,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    {
      to: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      roles: ['admin', 'accountant', 'student'],
    },
    {
      to: '/students',
      icon: <Users size={20} />,
      label: 'Students',
      roles: ['admin', 'accountant'],
    },
    {
      to: '/students/add',
      icon: <UserPlus size={20} />,
      label: 'Add Student',
      roles: ['admin'],
    },
    {
      to: '/fees',
      icon: <Receipt size={20} />,
      label: 'Fee Structure',
      roles: ['admin', 'accountant', 'student'],
    },
    {
      to: '/payments',
      icon: <CreditCard size={20} />,
      label: 'Payments',
      roles: ['admin', 'accountant'],
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <aside className="w-64 bg-white shadow-sm border-r hidden lg:block">
      <nav className="p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;