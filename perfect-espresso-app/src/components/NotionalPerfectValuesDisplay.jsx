import React from 'react';

// NotionalPerfectValuesDisplay component
export default function NotionalPerfectValuesDisplay({
  notionalPerfectValues,
  shotType,
  filterType,
  tempUnit,
  celsiusToFahrenheit,
}) {
  if (!notionalPerfectValues) {
    return (
      <div className="mb-10 p-6 bg-yellow-50 rounded-lg shadow-inner border border-yellow-200 text-yellow-800">
        <p className="font-medium text-center">
          Select a "Shot Type" and "Filter Type" above to see notional perfect values.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10 p-6 bg-blue-50 rounded-lg shadow-inner border border-blue-200">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4 text-center">
        Notional Perfect Values for {shotType} {filterType}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <p>
          <strong className="text-blue-700">Dose:</strong> {notionalPerfectValues.doseGramsDisplay}
        </p>
        <p>
          <strong className="text-blue-700">Yield:</strong> {notionalPerfectValues.yieldGrams}
        </p>
        <p>
          <strong className="text-blue-700">Brew Time:</strong> {notionalPerfectValues.brewTimeSeconds}
        </p>
        <p>
          <strong className="text-blue-700">Water Temp:</strong> {tempUnit === 'C'
            ? notionalPerfectValues.waterTempCelsius
            : notionalPerfectValues.waterTempFahrenheit}
        </p>
        <p className="sm:col-span-2">
          <strong className="text-blue-700">Puck Condition:</strong> {notionalPerfectValues.puckCondition}
        </p>
      </div>
      <p className="mt-4 text-sm text-gray-600 text-center italic">
        These are general guidelines and may vary based on coffee bean, roast, and equipment.
      </p>
    </div>
  );
}
