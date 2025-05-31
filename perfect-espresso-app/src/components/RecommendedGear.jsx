import React from 'react';

export default function RecommendedGear({ gearItems }) {
  return (
    <div className="mb-10 p-6 bg-yellow-50 rounded-lg shadow-inner border border-yellow-200">
      <h2 className="text-2xl font-semibold text-yellow-800 mb-4 text-center">Recommended Gear</h2>
      <p className="text-gray-700 mb-6 text-center">
        Based on your significant factors and general espresso best practices, here's some gear that might help improve your brewing.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gearItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105
              ${item.highlighted ? 'bg-yellow-200 border-2 border-yellow-600' : 'bg-white border border-gray-200'}`
            }
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-700 mb-3">{item.description}</p>
            <a
              href={`https://www.amazon.com/s?k=${encodeURIComponent(item.amazonSearchTerm)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Find on Amazon
              <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
