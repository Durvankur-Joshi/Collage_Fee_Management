import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-4 px-6">
      <div className="text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} College Fee Management System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;