import React from 'react';

const Footer = ({ className }) => {
  return (
    <footer className={`bg-rose-950 text-white py-4 mt-5 text-center ${className}`}>
      <div className="mt-2 text-sm">
        <a href="#" className="text-white hover:text-gray-300 mx-2">
          Privacy Policy
        </a>
        <a href="#" className="text-white hover:text-gray-300 mx-2">
          Terms of Service
        </a>
        <a href="#" className="text-white hover:text-gray-300 mx-2">
          Contact Us
        </a>
      </div>
      <p className="text-sm mt-3">
        &copy; {new Date().getFullYear()} Eat's&amp;Share's. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;