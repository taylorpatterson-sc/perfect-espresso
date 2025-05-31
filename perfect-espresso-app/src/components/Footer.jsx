import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 py-6 text-center text-gray-600 text-sm">
      <p>&copy; {new Date().getFullYear()} Espresso Experiment Tracker. All rights reserved.</p>
      <p className="mt-2">
        <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mx-2">Privacy Policy</a>
        |
        <a href="/terms-conditions.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mx-2">Terms & Conditions</a>
      </p>
    </footer>
  );
}
