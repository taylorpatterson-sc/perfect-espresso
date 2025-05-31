import React from 'react';

export default function AISuggestionsDisplay({
  isGeneratingSuggestions,
  errorGeneratingSuggestions,
  aiAnalysis,
  currentDisplayedSuggestion,
  selectedShotTypeOption,
  setSelectedShotTypeOption,
  selectedFilterTypeOption,
  setSelectedFilterTypeOption,
  selectedCoffeeTypeOption,
  setSelectedCoffeeTypeOption,
  updateDisplayedSuggestion,
}) {
  const handleShotTypeChange = (e) => {
    const newShotType = e.target.value;
    setSelectedShotTypeOption(newShotType);
    updateDisplayedSuggestion(newShotType, selectedFilterTypeOption, selectedCoffeeTypeOption);
  };

  const handleFilterTypeChange = (e) => {
    const newFilterType = e.target.value;
    setSelectedFilterTypeOption(newFilterType);
    updateDisplayedSuggestion(selectedShotTypeOption, newFilterType, selectedCoffeeTypeOption);
  };

  const handleCoffeeTypeChange = (e) => {
    const newCoffeeType = e.target.value;
    setSelectedCoffeeTypeOption(newCoffeeType);
    updateDisplayedSuggestion(selectedShotTypeOption, selectedFilterTypeOption, newCoffeeType);
  };

  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 text-center">
        AI Brew Suggestions & DOE Analysis
      </h2>
      {isGeneratingSuggestions ? (
        <div className="text-center text-blue-600 italic mb-10">
          Generating suggestions and analysis...
        </div>
      ) : errorGeneratingSuggestions ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-10 rounded-lg shadow-md">
          <p className="font-bold">Error:</p>
          <p>{errorGeneratingSuggestions}</p>
          <p className="mt-2">Please try adding another experiment or refresh the page.</p>
        </div>
      ) : aiAnalysis && currentDisplayedSuggestion ? (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 mb-10 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-2">Primary Next Brew Suggestion:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Shot Type Dropdown */}
            <div>
              <label htmlFor="suggestedShotType" className="block text-sm font-medium text-gray-700 mb-1">
                Shot Type
              </label>
              <select
                id="suggestedShotType"
                value={selectedShotTypeOption}
                onChange={handleShotTypeChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
              >
                <option value="">Select</option> {/* Added empty option */}
                <option value="Single">Single Shot</option>
                <option value="Double">Double Shot</option>
              </select>
            </div>

            {/* Filter Type Dropdown */}
            <div>
              <label htmlFor="suggestedFilterType" className="block text-sm font-medium text-gray-700 mb-1">
                Filter Type
              </label>
              <select
                id="suggestedFilterType"
                value={selectedFilterTypeOption}
                onChange={handleFilterTypeChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
              >
                <option value="">Select</option> {/* Added empty option */}
                <option value="Single Wall">Single-Wall Filter</option>
                <option value="Dual Wall (Pressurized)">Dual-Wall (Pressurized) Filter</option>
              </select>
            </div>

            {/* Coffee Type Dropdown */}
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="suggestedCoffeeType" className="block text-sm font-medium text-gray-700 mb-1">
                Coffee Type
              </label>
              <select
                id="suggestedCoffeeType"
                value={selectedCoffeeTypeOption}
                onChange={handleCoffeeTypeChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
              >
                <option value="">Select</option> {/* Added empty option */}
                <option value="Bean">Grind Coffee (from beans)</option>
                <option value="Pre-ground">Pre-ground Coffee</option>
              </select>
            </div>
          </div>

          <ul className="list-disc list-inside space-y-1">
            <li>
              <span className="font-medium">Grind Setting:</span>{' '}
              {currentDisplayedSuggestion.grindSetting === "Pre-ground"
                ? "Pre-ground Coffee"
                : `Grind Coffee (setting: ${currentDisplayedSuggestion.grindSetting})`
              }
            </li>
            <li><span className="font-medium">Dose:</span> {currentDisplayedSuggestion.doseGrams} grams</li>
            <li><span className="font-medium">Tamp Pressure:</span> {currentDisplayedSuggestion.tampPressure} lbs</li>
            {currentDisplayedSuggestion.yieldGrams && <li><span className="font-medium">Yield:</span> {currentDisplayedSuggestion.yieldGrams} grams</li>}
            {currentDisplayedSuggestion.brewTimeSeconds && <li><span className="font-medium">Brew Time:</span> {currentDisplayedSuggestion.brewTimeSeconds} seconds</li>}
            {currentDisplayedSuggestion.waterTempCelsius && <li><span className="font-medium">Water Temp:</span> {currentDisplayedSuggestion.waterTempCelsius}°C</li>}
            {currentDisplayedSuggestion.puckCondition && <li><span className="font-medium">Puck Condition:</span> {currentDisplayedSuggestion.puckCondition}</li>}
          </ul>

          <h3 className="font-bold text-lg mb-2 mt-4">DOE Analysis Summary:</h3>
          <p className="mb-2">{aiAnalysis.analysisSummary}</p>
          {aiAnalysis.significantFactors && aiAnalysis.significantFactors.length > 0 && (
            <p className="text-sm italic">
              <span className="font-semibold">Key Factors Identified:</span> {aiAnalysis.significantFactors.join(', ')}
            </p>
          )}
          <p className="mt-3 text-sm italic">
            AI suggestions are based on the patterns in your recorded data. The more data you provide, the better the insights!
          </p>
        </div>
      ) : (
        <p className="text-center text-gray-600 italic mb-10">
          Record a few experiments to get AI-powered brew suggestions and analysis!
        </p>
      )}
    </>
  );
}
