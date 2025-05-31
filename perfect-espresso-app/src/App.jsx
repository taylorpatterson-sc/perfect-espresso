import React, { useState, useEffect } from 'react';
import ExperimentForm from './components/ExperimentForm.jsx';
import NotionalPerfectValuesDisplay from './components/NotionalPerfectValuesDisplay.jsx';
import AISuggestionsDisplay from './components/AISuggestionsDisplay.jsx';
import ExperimentHistoryTable from './components/ExperimentHistoryTable.jsx';
import RecommendedGear from './components/RecommendedGear.jsx';
import ConfirmationDialog from './components/ConfirmationDialog.jsx';
import Footer from './components/Footer.jsx';

// Main App component
export default function App() {
  // State to hold the list of espresso experiments
  // Initialize state by trying to load from localStorage
  const [experiments, setExperiments] = useState(() => {
    try {
      const savedExperiments = localStorage.getItem('espressoExperiments');
      return savedExperiments ? JSON.parse(savedExperiments) : [];
    } catch (error) {
      console.error("Failed to load experiments from localStorage:", error);
      return []; // Return empty array if there's an error
    }
  });

  // State for the form inputs
  const [grindSetting, setGrindSetting] = useState('');
  const [doseGrams, setDoseGrams] = useState('');
  const [yieldGrams, setYieldGrams] = useState('');
  const [brewTimeSeconds, setBrewTimeSeconds] = useState('');
  const [waterTempCelsius, setWaterTempCelsius] = useState(''); // Stored internally as Celsius
  const [puckCondition, setPuckCondition] = useState('');
  const [tampPressure, setTampPressure] = useState(''); // Changed back to string for dropdown
  const [shotType, setShotType] = useState('');
  const [filterType, setFilterType] = useState('');
  const [tasteRating, setTasteRating] = useState('');
  const [notes, setNotes] = useState('');
  const [isPreGround, setIsPreGround] = useState(false); // New state for pre-ground coffee
  const [tempUnit, setTempUnit] = useState('C'); // New state for temperature unit (C or F)

  // State to control the visibility of the pre-ground/single-wall warning
  const [showPreGroundSingleWallWarning, setShowPreGroundSingleWallWarning] = useState(false);

  // State to hold the AI-generated brew suggestions and analysis
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [errorGeneratingSuggestions, setErrorGeneratingSuggestions] = useState(null);

  // State to hold the notional perfect resultant values, now including min/max dose
  const [notionalPerfectValues, setNotionalPerfectValues] = useState(null);

  // New states for controlling the displayed next brew suggestion dynamically
  const [currentDisplayedSuggestion, setCurrentDisplayedSuggestion] = useState(null);
  const [selectedShotTypeOption, setSelectedShotTypeOption] = useState('');
  const [selectedFilterTypeOption, setSelectedFilterTypeOption] = useState('');
  const [selectedCoffeeTypeOption, setSelectedCoffeeTypeOption] = useState(''); // "Bean" or "Pre-ground"

  // State for confirmation dialog
  const [showConfirmResetDialog, setShowConfirmResetDialog] = useState(false);


  // Helper function to convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  // Helper function to convert Fahrenheit to Celsius
  const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * 5/9;
  };

  // Define notional perfect values based on shot type and filter type
  const getNotionalPerfectValues = (currentShotType, currentFilterType) => {
    if (!currentShotType || !currentFilterType) {
      return null;
    }

    let perfect = {};

    if (currentFilterType === "Single Wall") {
      if (currentShotType === "Single") {
        perfect = {
          doseGramsDisplay: '7-10g', // Display string
          minDose: 7, // Numerical min for input validation
          maxDose: 10, // Numerical max for input validation
          yieldGrams: '18-20g',
          brewTimeSeconds: '25-30s',
          waterTempCelsius: '90-96°C', // Display string for Celsius
          waterTempFahrenheit: `${celsiusToFahrenheit(90).toFixed(0)}-${celsiusToFahrenheit(96).toFixed(0)}°F`, // Display string for Fahrenheit
          puckCondition: 'Firm and Dry',
        };
      } else if (currentShotType === "Double") {
        perfect = {
          doseGramsDisplay: '14-22g', // Display string
          minDose: 14,
          maxDose: 22,
          yieldGrams: '36-40g',
          brewTimeSeconds: '25-30s',
          waterTempCelsius: '90-96°C',
          waterTempFahrenheit: `${celsiusToFahrenheit(90).toFixed(0)}-${celsiusToFahrenheit(96).toFixed(0)}°F`,
          puckCondition: 'Firm and Dry',
        };
      }
    } else if (currentFilterType === "Dual Wall (Pressurized)") {
      if (currentShotType === "Single") {
        perfect = {
          doseGramsDisplay: '7-10g', // Display string
          minDose: 7,
          maxDose: 10,
          yieldGrams: '14-16g',
          brewTimeSeconds: '20-25s',
          waterTempCelsius: '90-96°C',
          waterTempFahrenheit: `${celsiusToFahrenheit(90).toFixed(0)}-${celsiusToFahrenheit(96).toFixed(0)}°F`,
          puckCondition: 'Slightly Wet to Firm',
        };
      } else if (currentShotType === "Double") {
        perfect = {
          doseGramsDisplay: '14-18g', // Display string
          minDose: 14,
          maxDose: 18,
          yieldGrams: '28-32g',
          brewTimeSeconds: '20-25s',
          waterTempCelsius: '90-96°C',
          waterTempFahrenheit: `${celsiusToFahrenheit(90).toFixed(0)}-${celsiusToFahrenheit(96).toFixed(0)}°F`,
          puckCondition: 'Slightly Wet to Firm',
        };
      }
    }
    return perfect;
  };

  // Effect to update notional perfect values when shotType or filterType changes
  useEffect(() => {
    setNotionalPerfectValues(getNotionalPerfectValues(shotType, filterType));
  }, [shotType, filterType]);


  // Effect to save experiments to localStorage whenever the experiments state changes
  useEffect(() => {
    try {
      localStorage.setItem('espressoExperiments', JSON.stringify(experiments));
    } catch (error) {
      console.error("Failed to save experiments to localStorage:", error);
    }
  }, [experiments]); // Dependency array ensures this runs when 'experiments' changes

  // Helper to determine coffee type from grind setting
  const getCoffeeTypeFromGrindSetting = (grind) => {
    return grind === "Pre-ground" ? "Pre-ground" : "Bean";
  };

  // Function to call the AI model for suggestions and analysis
  const getAISuggestions = async (currentExperiments) => {
    if (currentExperiments.length === 0) {
      setAiAnalysis(null);
      setCurrentDisplayedSuggestion(null); // Clear displayed suggestion
      return;
    }

    setIsGeneratingSuggestions(true);
    setErrorGeneratingSuggestions(null);

    // Prepare the chat history for the Gemini API call
    let chatHistory = [];
    const prompt = `
      Analyze the following espresso experiment data to identify significant factors influencing 'Taste Rating' (1-5, 5 being excellent) and suggest optimal parameters for the next brew.

      Input variables (factors you control): Grind Setting (text, can be "Pre-ground"), Dose (grams), Tamp Pressure (categorical: "20", "25", "30"), Shot Type (Single, Double), Filter Type (Dual Wall, Single Wall).
      Resultant variables (outcomes you measure): Yield (grams), Brew Time (seconds), Water Temp (Celsius, optional), Puck Condition (Firm and Dry, Slightly Wet, Soupy, Cracked, Intact with no cracks, Channeling Evident), Taste Rating (1-5), and Notes.

      Here is the experiment data in JSON format:
      ${JSON.stringify(currentExperiments, null, 2)}

      Please provide your analysis and suggestions in a JSON object with the following structure:
      {
        "significantFactors": ["factor1", "factor2", ...], // List of factors most impacting taste
        "nextBrewSuggestions": {
          "grindSetting": "suggested_value", // If not "Pre-ground", provide a specific grind setting (e.g., "Fine", "Medium-Fine", or a numerical value like "18 clicks").
          "doseGrams": suggested_value_float,
          "tampPressure": "suggested_value", // AI should suggest one of the categorical values
          "shotType": "suggested_value",
          "filterType": "suggested_value",
          "yieldGrams": suggested_value_float_or_null,
          "brewTimeSeconds": suggested_value_float_or_null,
          "waterTempCelsius": suggested_value_float_or_null,
          "puckCondition": "suggested_value_or_null"
        },
        "fullBrewMatrix": [
          {
            "shotType": "Single",
            "filterType": "Single Wall",
            "coffeeType": "Bean",
            "grindSetting": "suggested_value",
            "doseGrams": suggested_value_float,
            "tampPressure": "suggested_value",
            "yieldGrams": suggested_value_float_or_null,
            "brewTimeSeconds": suggested_value_float_or_null,
            "waterTempCelsius": suggested_value_float_or_null,
            "puckCondition": "suggested_value_or_null",
            "reasoning": "A brief explanation for these settings."
          },
          {
            "shotType": "Single",
            "filterType": "Single Wall",
            "coffeeType": "Pre-ground",
            "grindSetting": "Pre-ground",
            "doseGrams": suggested_value_float,
            "tampPressure": "suggested_value",
            "yieldGrams": suggested_value_float_or_null,
            "brewTimeSeconds": suggested_value_float_or_null,
            "waterTempCelsius": suggested_value_float_or_null,
            "puckCondition": "suggested_value_or_null",
            "reasoning": "A brief explanation for these settings."
          },
          {
            "shotType": "Single",
            "filterType": "Dual Wall (Pressurized)",
            "coffeeType": "Bean",
            "grindSetting": "suggested_value",
            "doseGrams": suggested_value_float,
            "tampPressure": "suggested_value",
            "yieldGrams": suggested_value_float_or_null,
            "brewTimeSeconds": suggested_value_float_or_null,
            "waterTempCelsius": suggested_value_float_or_null,
            "puckCondition": "suggested_value_or_null",
            "reasoning": "A brief explanation for these settings."
          },
          {
            "shotType": "Single",
            "filterType": "Dual Wall (Pressurized)",
            "coffeeType": "Pre-ground",
            "grindSetting": "Pre-ground",
            "doseGrams": suggested_value_float,
            "tampPressure": "suggested_value",
            "yieldGrams": suggested_value_float_or_null,
            "brewTimeSeconds": suggested_value_float_or_null,
            "waterTempCelsius": suggested_value_float_or_null,
            "puckCondition": "suggested_value_or_null",
            "reasoning": "A brief explanation for these settings."
          },
          {
            "shotType": "Double",
            "filterType": "Single Wall",
            "coffeeType": "Bean",
            "grindSetting": "suggested_value",
            "doseGrams": suggested_value_float,
            "tampPressure": "suggested_value",
            "yieldGrams": suggested_value_float_or_null,
            "brewTimeSeconds": suggested_value_float_or_null,
            "waterTempCelsius": suggested_value_float_or_null,
            "puckCondition": "suggested_value_or_null",
            "reasoning": "A brief explanation for these settings."
          },
          {
            "shotType": "Double",
            "filterType": "Single Wall",
            "coffeeType": "Pre-ground",
            "grindSetting": "Pre-ground",
            "doseGrams": suggested_value_float,
            "tampPressure": "suggested_value",
            "yieldGrams": suggested_value_float_or_null,
            "brewTimeSeconds": suggested_value_float_or_null,
            "waterTempCelsius": suggested_value_float_or_null,
            "puckCondition": "suggested_value_or_null",
            "reasoning": "A brief explanation for these settings."
          },
          {
            "shotType": "Double",
            "filterType": "Dual Wall (Pressurized)",
            "coffeeType": "Bean",
            "grindSetting": "suggested_value",
            "doseGrams": suggested_value_float,
            "tampPressure": "suggested_value",
            "yieldGrams": suggested_value_float_or_null,
            "brewTimeSeconds": suggested_value_float_or_null,
            "waterTempCelsius": suggested_value_float_or_null,
            "puckCondition": "suggested_value_or_null",
            "reasoning": "A brief explanation for these settings."
          },
          {
            "shotType": "Double",
            "filterType": "Dual Wall (Pressurized)",
            "coffeeType": "Pre-ground",
            "grindSetting": "Pre-ground",
            "doseGrams": suggested_value_float,
            "tampPressure": "suggested_value",
            "shotType": "Double",
            "filterType": "Dual Wall (Pressurized)",
            "yieldGrams": suggested_value_float_or_null,
            "brewTimeSeconds": suggested_value_float_or_null,
            "waterTempCelsius": suggested_value_float_or_null,
            "puckCondition": "suggested_value_or_null",
            "reasoning": "A brief explanation for these settings."
          }
        ],
        "analysisSummary": "A brief summary of the DOE analysis and findings."
      }
    `;

    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
      contents: chatHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "significantFactors": {
              "type": "ARRAY",
              "items": { "type": "STRING" }
            },
            "nextBrewSuggestions": {
              "type": "OBJECT",
              "properties": {
                "grindSetting": { "type": "STRING" },
                "doseGrams": { "type": "NUMBER" },
                "tampPressure": { "type": "STRING" },
                "shotType": { "type": "STRING" },
                "filterType": { "type": "STRING" },
                "yieldGrams": { "type": ["NUMBER", "NULL"] },
                "brewTimeSeconds": { "type": ["NUMBER", "NULL"] },
                "waterTempCelsius": { "type": ["NUMBER", "NULL"] },
                "puckCondition": { "type": ["STRING", "NULL"] }
              },
              "required": ["grindSetting", "doseGrams", "tampPressure", "shotType", "filterType"]
            },
            "fullBrewMatrix": {
              "type": "ARRAY",
              "items": {
                "type": "OBJECT",
                "properties": {
                  "shotType": { "type": "STRING" },
                  "filterType": { "type": "STRING" },
                  "coffeeType": { "type": "STRING" },
                  "grindSetting": { "type": "STRING" },
                  "doseGrams": { "type": "NUMBER" },
                  "tampPressure": { "type": "STRING" },
                  "yieldGrams": { "type": ["NUMBER", "NULL"] },
                  "brewTimeSeconds": { "type": ["NUMBER", "NULL"] },
                  "waterTempCelsius": { "type": ["NUMBER", "NULL"] },
                  "puckCondition": { "type": ["STRING", "NULL"] },
                  "reasoning": { "type": "STRING" }
                },
                "required": ["shotType", "filterType", "coffeeType", "grindSetting", "doseGrams", "tampPressure"]
              }
            },
            "analysisSummary": { "type": "STRING" }
          },
          "required": ["significantFactors", "nextBrewSuggestions", "fullBrewMatrix", "analysisSummary"]
        }
      }
    };

    const apiKey = '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        let json = result.candidates[0].content.parts[0].text;
        // IMPORTANT FIX: Remove markdown code block fences if present
        if (json.startsWith('```json')) {
          json = json.substring(7); // Remove '```json'
        }
        if (json.endsWith('```')) {
          json = json.substring(0, json.length - 3); // Remove '```'
        }
        const parsedJson = JSON.parse(json);
        setAiAnalysis(parsedJson);
        // Set the initial displayed suggestion to the primary one
        setCurrentDisplayedSuggestion(parsedJson.nextBrewSuggestions);
        setSelectedShotTypeOption(parsedJson.nextBrewSuggestions.shotType || '');
        setSelectedFilterTypeOption(parsedJson.nextBrewSuggestions.filterType || '');
        setSelectedCoffeeTypeOption(getCoffeeTypeFromGrindSetting(parsedJson.nextBrewSuggestions.grindSetting) || '');

      } else {
        setErrorGeneratingSuggestions("AI response structure was unexpected or content was missing.");
        console.error("AI response error:", result);
      }
    } catch (error) {
      setErrorGeneratingSuggestions(`Failed to get AI suggestions: ${error.message}`);
      console.error("Error calling Gemini API:", error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  // Effect to trigger AI suggestions when component mounts with pre-loaded experiments
  useEffect(() => {
    if (experiments.length > 0) {
      getAISuggestions(experiments);
    }
  }, []); // Run only once on component mount

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Determine grind setting value based on pre-ground checkbox
    const finalGrindSetting = isPreGround ? "Pre-ground" : grindSetting;

    // Convert water temperature to Celsius before storing
    const tempToStore = waterTempCelsius ? (tempUnit === 'F' ? fahrenheitToCelsius(parseFloat(waterTempCelsius)) : parseFloat(waterTempCelsius)) : null;

    // Create a new experiment object
    const newExperiment = {
      id: Date.now(), // Unique ID for the experiment
      date: new Date().toLocaleDateString(), // Current date
      grindSetting: finalGrindSetting,
      doseGrams: parseFloat(doseGrams),
      yieldGrams: yieldGrams ? parseFloat(yieldGrams) : null,
      brewTimeSeconds: brewTimeSeconds ? parseFloat(brewTimeSeconds) : null,
      waterTempCelsius: tempToStore, // Store as Celsius
      puckCondition,
      tampPressure, // Store as string from dropdown
      shotType,
      filterType,
      tasteRating: tasteRating ? parseInt(tasteRating, 10) : null,
      notes,
    };

    // Add the new experiment to the list
    const updatedExperiments = [...experiments, newExperiment];
    setExperiments(updatedExperiments); // This will trigger the localStorage save effect

    // Trigger AI suggestion generation after adding new experiment

    getAISuggestions(updatedExperiments);

    // Clear the form fields after submission (now handled by useEffect based on AI analysis)
    // setGrindSetting('');
    // setDoseGrams('');
    // setYieldGrams('');
    // setBrewTimeSeconds('');
    // setWaterTempCelsius('');
    // setPuckCondition('');
    // setTampPressure('');
    // setShotType('');
    // setFilterType('');
    // setTasteRating('');
    // setNotes('');
    // setIsPreGround(false);
  };

  // Effect to populate input fields with AI suggestions after analysis is received
  // This effect now only populates the *form* fields, not the displayed suggestion
  useEffect(() => {
    if (aiAnalysis && aiAnalysis.nextBrewSuggestions) {
      const suggestions = aiAnalysis.nextBrewSuggestions;

      setGrindSetting(suggestions.grindSetting || '');
      setDoseGrams(suggestions.doseGrams !== null ? suggestions.doseGrams.toString() : '');
      setTampPressure(suggestions.tampPressure || '');
      setShotType(suggestions.shotType || '');
      setFilterType(suggestions.filterType || '');
      setYieldGrams(''); // Clear resultant variables for next experiment
      setBrewTimeSeconds('');
      setWaterTempCelsius(suggestions.waterTempCelsius !== null
        ? (tempUnit === 'F' ? celsiusToFahrenheit(suggestions.waterTempCelsius).toFixed(1) : suggestions.waterTempCelsius.toFixed(1))
        : ''
      );
      setPuckCondition('');
      setIsPreGround(suggestions.grindSetting === "Pre-ground");
      setTasteRating('');
      setNotes('');
    }
  }, [aiAnalysis, tempUnit]); // This effect runs whenever aiAnalysis or tempUnit changes

  // Effect to show/hide the pre-ground/single-wall warning
  useEffect(() => {
    if (isPreGround && filterType === "Single Wall") {
      setShowPreGroundSingleWallWarning(true);
    } else {
      setShowPreGroundSingleWallWarning(false);
    }
  }, [isPreGround, filterType]);

  // Define gear items and their mapping to significant factors
  const initialGearItems = [
    {
      id: 'espresso-scale',
      title: 'Espresso Scale',
      description: 'Crucial for precise measurement of coffee dose and espresso yield. Look for scales with 0.1 gram accuracy and a timer function.',
      amazonSearchTerm: 'espresso scale 0.1g with timer best seller',
      factors: ['Dose (grams)', 'Yield (grams)', 'Brew Time (seconds)'],
      highlighted: false,
      alwaysShow: true // Always show this item
    },
    {
      id: 'espresso-tamper',
      title: 'Espresso Tamper',
      description: 'Ensures an even and consistent puck. Consider calibrated tampers for repeatable pressure, or precision tampers matched to your basket size.',
      amazonSearchTerm: 'calibrated espresso tamper amazon choice',
      factors: ['Tamp Pressure'],
      highlighted: false,
      alwaysShow: true // Always show this item
    },
    {
      id: 'coffee-grinder',
      title: 'Coffee Grinder (Burr Grinder)',
      description: 'The most important piece of equipment after the espresso machine itself. A quality burr grinder provides consistent particle size, essential for good extraction.',
      amazonSearchTerm: 'espresso burr grinder electric highly rated',
      factors: ['Grind Setting'],
      highlighted: false,
      alwaysShow: false // Only show if not pre-ground
    },
    {
      id: 'wdt-tool',
      title: 'WDT (Weiss Distribution Technique) Tool',
      description: 'Helps break up clumps and distribute coffee grounds evenly in the portafilter basket, reducing channeling and improving extraction.',
      amazonSearchTerm: 'WDT tool espresso best seller',
      factors: ['Puck Condition'], // WDT directly impacts puck condition and channeling
      highlighted: false,
      alwaysShow: true
    },
    {
      id: 'puck-screen',
      title: 'Puck Screen / Sieve',
      description: 'Placed on top of the coffee puck before brewing, it helps distribute water more evenly and keeps the group head cleaner.',
      amazonSearchTerm: 'espresso puck screen amazon choice',
      factors: ['Puck Condition'], // Puck screen impacts water distribution and thus puck condition
      highlighted: false,
      alwaysShow: true
    },
    {
      id: 'bottomless-portafilter',
      title: 'Bottomless Portafilter',
      description: 'While not strictly a "tool to help the process," a bottomless portafilter is invaluable for diagnosing extraction issues (like channeling or unevenness) visually.',
      amazonSearchTerm: 'bottomless portafilter highly rated',
      factors: ['Puck Condition'], // Used to diagnose issues related to puck condition
      highlighted: false,
      alwaysShow: true
    },
    {
      id: 'nespresso-system',
      title: 'Nespresso System',
      description: 'If the traditional espresso process is proving too complex or frustrating, a Nespresso machine offers a convenient, single-serve alternative with consistent results and minimal effort.',
      amazonSearchTerm: 'nespresso machine and pods',
      factors: [], // No direct alignment with current significant factors, as it's an alternative
      highlighted: false,
      alwaysShow: true
    },
  ];

  const [gearItems, setGearItems] = useState(initialGearItems);

  // Effect to highlight gear items based on AI analysis and pre-ground status
  useEffect(() => {
    const currentSignificantFactors = aiAnalysis?.significantFactors || [];

    const updatedGearItems = initialGearItems.map(item => {
      let isHighlighted = false;
      if (currentSignificantFactors.length > 0) {
        if (item.id === 'coffee-grinder' && isPreGround) {
          // If pre-ground, coffee grinder is not a "significant factor" for highlighting
          isHighlighted = false;
        } else {
          isHighlighted = currentSignificantFactors.some(factor =>
            item.factors.includes(factor)
          );
        }
      }
      return { ...item, highlighted: isHighlighted };
    });
    setGearItems(updatedGearItems);
  }, [aiAnalysis, isPreGround]); // Add isPreGround to dependency array

  // Function to show the confirmation dialog
  const handleShowResetConfirm = () => {
    setShowConfirmResetDialog(true);
  };

  // Function to confirm reset
  const handleConfirmReset = () => {
    // Clear experiments from state
    setExperiments([]);
    // Clear experiments from localStorage
    localStorage.removeItem('espressoExperiments');
    // Clear AI analysis and suggestions
    setAiAnalysis(null);
    setCurrentDisplayedSuggestion(null); // Clear displayed suggestion
    // Reset form fields to initial empty state
    setGrindSetting('');
    setDoseGrams('');
    setYieldGrams('');
    setBrewTimeSeconds('');
    setWaterTempCelsius('');
    setPuckCondition('');
    setTampPressure('');
    setShotType('');
    setFilterType('');
    setTasteRating('');
    setNotes('');
    setIsPreGround(false);
    setTempUnit('C'); // Reset temperature unit to default
    setShowPreGroundSingleWallWarning(false); // Hide any warnings

    // Reset dropdown selections
    setSelectedShotTypeOption('');
    setSelectedFilterTypeOption('');
    setSelectedCoffeeTypeOption('');

    setShowConfirmResetDialog(false); // Close the dialog
  };

  // Function to cancel reset
  const handleCancelReset = () => {
    setShowConfirmResetDialog(false); // Close the dialog
  };


  // Function to update the displayed suggestion based on dropdown selections
  const updateDisplayedSuggestion = (shotType, filterType, coffeeType) => {
    if (!aiAnalysis || !aiAnalysis.fullBrewMatrix) {
      setCurrentDisplayedSuggestion(null);
      return;
    }

    const foundSuggestion = aiAnalysis.fullBrewMatrix.find(
      (s) =>
        s.shotType === shotType &&
        s.filterType === filterType &&
        s.coffeeType === coffeeType
    );

    setCurrentDisplayedSuggestion(foundSuggestion || null);
  };


  return (
    // Reverted to original styling for the container
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">
          Espresso Experiment Tracker ☕
        </h1>

        <ExperimentForm
          handleSubmit={handleSubmit}
          grindSetting={grindSetting}
          setGrindSetting={setGrindSetting}
          doseGrams={doseGrams}
          setDoseGrams={setDoseGrams}
          tampPressure={tampPressure}
          setTampPressure={setTampPressure}
          shotType={shotType}
          setShotType={setShotType}
          filterType={filterType}
          setFilterType={setFilterType}
          yieldGrams={yieldGrams}
          setYieldGrams={setYieldGrams}
          brewTimeSeconds={brewTimeSeconds}
          setBrewTimeSeconds={setBrewTimeSeconds}
          waterTempCelsius={waterTempCelsius}
          setWaterTempCelsius={setWaterTempCelsius}
          puckCondition={puckCondition}
          setPuckCondition={setPuckCondition}
          tasteRating={tasteRating}
          setTasteRating={setTasteRating}
          notes={notes}
          setNotes={setNotes}
          isPreGround={isPreGround}
          setIsPreGround={setIsPreGround}
          tempUnit={tempUnit}
          setTempUnit={setTempUnit}
          showPreGroundSingleWallWarning={showPreGroundSingleWallWarning}
          notionalPerfectValues={notionalPerfectValues}
        />

        <NotionalPerfectValuesDisplay
          notionalPerfectValues={notionalPerfectValues}
          shotType={shotType}
          filterType={filterType}
          tempUnit={tempUnit}
          celsiusToFahrenheit={celsiusToFahrenheit}
        />

        <AISuggestionsDisplay
          isGeneratingSuggestions={isGeneratingSuggestions}
          errorGeneratingSuggestions={errorGeneratingSuggestions}
          aiAnalysis={aiAnalysis}
          currentDisplayedSuggestion={currentDisplayedSuggestion}
          selectedShotTypeOption={selectedShotTypeOption}
          setSelectedShotTypeOption={setSelectedShotTypeOption}
          selectedFilterTypeOption={selectedFilterTypeOption}
          setSelectedFilterTypeOption={setSelectedFilterTypeOption}
          selectedCoffeeTypeOption={selectedCoffeeTypeOption}
          setSelectedCoffeeTypeOption={setSelectedCoffeeTypeOption}
          updateDisplayedSuggestion={updateDisplayedSuggestion}
        />

        <ExperimentHistoryTable
          experiments={experiments}
          handleShowResetConfirm={handleShowResetConfirm}
          tempUnit={tempUnit}
          celsiusToFahrenheit={celsiusToFahrenheit}
        />

        <RecommendedGear
          gearItems={gearItems.filter(item => item.alwaysShow || (!item.alwaysShow && !isPreGround))}
        />
      </div>

      <ConfirmationDialog
        show={showConfirmResetDialog}
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />

      <Footer />
    </div>
  );
}