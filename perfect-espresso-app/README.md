# Espresso Experiment Tracker ☕

A web application designed to help espresso enthusiasts meticulously track their brewing experiments, analyze the results, and receive AI-powered suggestions for optimal future brews.

## ✨ Features

* **Experiment Logging:** Record detailed parameters for each espresso shot, including:
    * Grind Setting (supports "Pre-ground" or custom settings)
    * Dose (grams)
    * Tamp Pressure (20, 25, 30 lbs)
    * Shot Type (Single, Double)
    * Filter Type (Dual Wall / Pressurized, Single Wall)
    * Yield (grams)
    * Brew Time (seconds)
    * Water Temperature (Celsius or Fahrenheit)
    * Puck Condition
    * Taste Rating (1-5)
    * Notes
* **Local Data Storage:** All your experiment data is stored securely in your browser's local storage, ensuring privacy and offline access.
* **AI-Powered Suggestions:** Leverages the Gemini API to analyze your historical data and provide:
    * A primary "Next Brew Suggestion" with optimal input parameters.
    * Dynamic adjustment of suggestions based on selected Shot Type, Filter Type, and Coffee Type dropdowns.
    * Identification of "Significant Factors" influencing taste.
    * A summary of the Design of Experiments (DOE) analysis.
* **Notional Perfect Values:** Displays general guidelines for "perfect" resultant values (yield, brew time, etc.) based on selected shot and filter types.
* **Responsive Design:** Optimized for a seamless experience across various devices (mobile, tablet, desktop).
* **Recommended Gear:** Suggests relevant espresso accessories, highlighting those related to the AI's identified significant factors, with direct links to Amazon.
* **Data Reset with Confirmation:** A clear button to reset all stored experiment data, protected by a confirmation dialog to prevent accidental deletion.

## 🚀 Technologies Used

* **React:** A JavaScript library for building user interfaces.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **Local Storage:** For client-side data persistence.
* **Gemini API:** For AI-powered data analysis and brew suggestions.

## ⚙️ Setup and Installation



## 💡 Usage

1.  **Record Experiments:** Use the "Record a New Experiment" form to input details about each espresso shot you pull. The more data you enter, the better the AI's analysis will become.
2.  **View Suggestions:** After adding experiments, the "AI Brew Suggestions & DOE Analysis" section will display recommended parameters for your next brew.
3.  **Explore Alternatives:** Use the dropdowns in the "Primary Next Brew Suggestion" section to dynamically adjust the suggested Shot Type, Filter Type, and Coffee Type, and see how the AI's recommendations change.
4.  **Review History:** The "Experiment History" table provides a chronological record of all your past brews.
5.  **Reset Data:** If you wish to clear all your experiment data, use the "Reset All Experiments" button. Be aware that this action is irreversible.
6.  **Check Gear:** The "Recommended Espresso Gear" section offers suggestions for tools that might improve your brewing process, with highlighted items indicating relevance to factors identified by the AI.

## 🔒 Privacy and Data Handling

* **Local Storage:** All your experiment data is stored directly in your web browser's local storage. This means your data remains on your device and is not stored on any external servers controlled by us.
* **Gemini API:** When you request AI suggestions, your experiment data is sent to the Gemini API for processing. This data is used solely for generating the requested suggestions and is not stored by us. Please refer to Google's privacy policy for details on how Google handles data submitted to the Gemini API.
* **No PII Collection:** This application is designed to not collect any personally identifiable information (PII).

## 🔮 Future Enhancements