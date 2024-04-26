import React, { useState, useEffect } from "react";
import axios from "axios";
import Arrows from "./Arrows";
function SelectBox() {
  const [options, setOptions] = useState([]);
  const [outOptions, setOutOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOutOption, setSelectedOutOption] = useState("");
  const [textToTranslate, setTextToTranslate] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    // Fetch options from API
    axios
      .get("https://marv-google-translate-clone.onrender.com/languages")
      .then((response) => {
        setOptions(response.data);
        setOutOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  }, []);
  const handleLanguageSwap = () => {
    const temp = selectedOption;
    setSelectedOption(selectedOutOption);
    setSelectedOutOption(temp);
  };
  const clearInputTextArea = () => {
    setTextToTranslate("");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !selectedOption ||
      selectedOption === "auto" ||
      !selectedOutOption ||
      selectedOutOption === "auto" ||
      !textToTranslate.trim()
    ) {
      alert("Please select valid languages and enter text to translate.");
      return;
    }

    try {
      const data = {
        inputLanguage: selectedOption,
        outputLanguage: selectedOutOption,
        textToTranslate: textToTranslate,
      };
      const response = await axios.post(
        "https://marv-google-translate-clone.onrender.com/translation",
        data
      );

      // Assuming the API response contains the translated text
      setTranslatedText(response.data.trans);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleOutSelectChange = (event) => {
    setSelectedOutOption(event.target.value);
  };
  return (
    <div className="app">
      <div className="input">
        <select
          className="custom-select"
          id="select"
          value={selectedOption}
          onChange={handleSelectChange}
        >
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.language}
            </option>
          ))}
        </select>
        <div className="text-area-container">
          <textarea
            id="textToTranslate"
            placeholder="Enter Text"
            value={textToTranslate}
            onChange={(e) => setTextToTranslate(e.target.value)}
          />
          {textToTranslate && (
            <p className="clear-button" onClick={clearInputTextArea}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
              </svg>
            </p>
          )}
        </div>
      </div>
      <div className="arrow-container" onClick={handleLanguageSwap}>
        <Arrows />
      </div>
      <div className="output">
        <select
          className="custom-select"
          id="selectOut"
          value={selectedOutOption}
          onChange={handleOutSelectChange}
        >
          {outOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.language}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Translation"
          disabled
          className="textarea"
          id="translatedText"
          value={translatedText}
          onChange={(event) => setTranslatedText(event.target.value)}
        >
          {setTranslatedText}
        </textarea>
      </div>
      <div>
        <p className="submit" onClick={handleSubmit}>
          ➟
        </p>
      </div>
    </div>
  );
}

export default SelectBox;
