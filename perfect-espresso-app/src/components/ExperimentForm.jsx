import React from 'react';

// ExperimentForm component for inputting new experiment data
export default function ExperimentForm({
  handleSubmit,
  grindSetting,
  setGrindSetting,
  doseGrams,
  setDoseGrams,
  tampPressure,
  setTampPressure,
  shotType,
  setShotType,
  filterType,
  setFilterType,
  yieldGrams,
  setYieldGrams,
  brewTimeSeconds,
  setBrewTimeSeconds,
  waterTempCelsius,
  setWaterTempCelsius,
  puckCondition,
  setPuckCondition,
  tasteRating,
  setTasteRating,
  notes,
  setNotes,
  isPreGround,
  setIsPreGround,
  tempUnit,
  setTempUnit,
  showPreGroundSingleWallWarning,
  notionalPerfectValues, // Passed down for validation and display hints
}) {
  const tampPressureOptions = ["20", "25", "30"];

  const handleWaterTempChange = (e) => {
    const value = e.target.value;
    // Store as string, conversion happens on form submission
    setWaterTempCelsius(value);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 p-6 bg-blue-50 rounded-lg shadow-inner">
      <div className="col-span-1 md:col-span-2">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Record a New Experiment</h2>
      </div>

      {/* Input Variables Section */}
      <div className="col-span-1 md:col-span-2 border-b border-blue-200 pb-4 mb-4">
        <h3 className="text-xl font-semibold text-blue-600 mb-2">Input Variables (Factors you control)</h3>
      </div>

      {/* Pre-ground Coffee Checkbox */}
      <div className="col-span-2">
        <label htmlFor="isPreGround" className="flex items-center text-sm font-medium text-gray-700 mb-1 cursor-pointer">
          <input
            type="checkbox"
            id="isPreGround"
            checked={isPreGround}
            onChange={(e) => setIsPreGround(e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          Using Pre-ground Coffee?
        </label>
      </div>

      {/* Grind Setting (Conditional) */}
      <div className={`${isPreGround ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <label htmlFor="grindSetting" className="block text-sm font-medium text-gray-700 mb-1">
          Grind Setting {isPreGround ? '' : <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          id="grindSetting"
          value={isPreGround ? 'Pre-ground' : grindSetting}
          onChange={(e) => setGrindSetting(e.target.value)}
          placeholder="e.g., Fine, 18 clicks, 2.0"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          required={!isPreGround}
          disabled={isPreGround}
        />
      </div>

      {/* Dose (grams) (Required) */}
      <div>
        <label htmlFor="doseGrams" className="block text-sm font-medium text-gray-700 mb-1">
          Dose (grams) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="doseGrams"
          value={doseGrams}
          onChange={(e) => setDoseGrams(e.target.value)}
          placeholder="e.g., 18.0"
          step="0.1"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          required
        />
        {notionalPerfectValues && (
          <p className="text-xs text-gray-500 mt-1">
            Recommended: {notionalPerfectValues.doseGramsDisplay}
          </p>
        )}
      </div>

      {/* Tamp Pressure (Required) */}
      <div>
        <label htmlFor="tampPressure" className="block text-sm font-medium text-gray-700 mb-1">
          Tamp Pressure (lbs) <span className="text-red-500">*</span>
        </label>
        <select
          id="tampPressure"
          value={tampPressure}
          onChange={(e) => setTampPressure(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          required
        >
          <option value="">Select pressure</option>
          {tampPressureOptions.map((pressure) => (
            <option key={pressure} value={pressure}>{pressure} lbs</option>
          ))}
        </select>
      </div>

      {/* Shot Type (Required) */}
      <div>
        <label htmlFor="shotType" className="block text-sm font-medium text-gray-700 mb-1">
          Shot Type <span className="text-red-500">*</span>
        </label>
        <select
          id="shotType"
          value={shotType}
          onChange={(e) => setShotType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          required
        >
          <option value="">Select type</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
        </select>
      </div>

      {/* Filter Type (Required) */}
      <div>
        <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
          Filter Type <span className="text-red-500">*</span>
        </label>
        <select
          id="filterType"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          required
        >
          <option value="">Select type</option>
          <option value="Dual Wall (Pressurized)">Dual Wall (Pressurized)</option>
          <option value="Single Wall">Single Wall</option>
        </select>
        {showPreGroundSingleWallWarning && (
          <p className="text-red-600 text-xs mt-1">
            Warning: Single Wall filters are generally not recommended with pre-ground coffee.
          </p>
        )}
      </div>

      {/* Resultant Variables Section */}
      <div className="col-span-1 md:col-span-2 border-b border-blue-200 pt-4 pb-4 mt-4">
        <h3 className="text-xl font-semibold text-blue-600 mb-2">Resultant Variables (Outcomes you measure)</h3>
      </div>

      {/* Yield (grams) (Optional) */}
      <div>
        <label htmlFor="yieldGrams" className="block text-sm font-medium text-gray-700 mb-1">
          Yield (grams)
        </label>
        <input
          type="number"
          id="yieldGrams"
          value={yieldGrams}
          onChange={(e) => setYieldGrams(e.target.value)}
          placeholder="e.g., 36.0"
          step="0.1"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        />
      </div>

      {/* Brew Time (seconds) (Optional) */}
      <div>
        <label htmlFor="brewTimeSeconds" className="block text-sm font-medium text-gray-700 mb-1">
          Brew Time (seconds)
        </label>
        <input
          type="number"
          id="brewTimeSeconds"
          value={brewTimeSeconds}
          onChange={(e) => setBrewTimeSeconds(e.target.value)}
          placeholder="e.g., 28"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        />
      </div>

      {/* Water Temperature (Celsius/Fahrenheit) (Optional) */}
      <div className="flex items-end space-x-2">
        <div className="flex-grow">
          <label htmlFor="waterTemp" className="block text-sm font-medium text-gray-700 mb-1">
            Water Temp
          </label>
          <input
            type="number"
            id="waterTemp"
            value={waterTempCelsius}
            onChange={(e) => setWaterTempCelsius(e.target.value)}
            placeholder={tempUnit === 'C' ? "e.g., 93" : "e.g., 200"}
            step="0.1"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          />
        </div>
        <div className="flex-shrink-0">
          <label htmlFor="tempUnit" className="sr-only">Temperature Unit</label>
          <select
            id="tempUnit"
            value={tempUnit}
            onChange={(e) => setTempUnit(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out h-10"
          >
            <option value="C">°C</option>
            <option value="F">°F</option>
          </select>
        </div>
      </div>

      {/* Puck Condition (Optional) */}
      <div>
        <label htmlFor="puckCondition" className="block text-sm font-medium text-gray-700 mb-1">
          Puck Condition
        </label>
        <select
          id="puckCondition"
          value={puckCondition}
          onChange={(e) => setPuckCondition(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        >
          <option value="">Select condition</option>
          <option value="Firm and Dry">Firm and Dry</option>
          <option value="Slightly Wet">Slightly Wet</option>
          <option value="Soupy">Soupy (very wet, muddy)</option>
          <option value="Cracked">Cracked</option>
          <option value="Intact with no cracks">Intact (no cracks)</option>
          <option value="Channeling Evident">Channeling Evident (visible holes/tunnels)</option>
        </select>
      </div>

      {/* Taste Rating (1-5) (Optional) */}
      <div>
        <label htmlFor="tasteRating" className="block text-sm font-medium text-gray-700 mb-1">
          Taste Rating (1-5)
        </label>
        <input
          type="number"
          id="tasteRating"
          value={tasteRating}
          onChange={(e) => setTasteRating(e.target.value)}
          min="1"
          max="5"
          placeholder="1 (Bad) - 5 (Excellent)"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        />
      </div>

      {/* Notes (Optional) */}
      <div className="md:col-span-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          placeholder="e.g., Fruity notes, slightly bitter aftertaste, crema was thin."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2 flex justify-center space-x-4">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Add Experiment
        </button>
      </div>
    </form>
  );
}
