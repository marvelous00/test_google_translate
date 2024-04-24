const PORT = 8000;
const axios = require("axios").default;
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/languages", async (req, res) => {
  const options = {
    method: "GET",
    url: process.env.LANGUAGES_URL,
    headers: {
      "X-RapidAPI-Host": process.env.RAPID_API_HOST,
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    },
  };

  try {
    const response = await axios.request(options);
    const arrayOfData = Object.keys(response.data).map(
      (key) => response.data[key]
    );
    res.status(200).json(arrayOfData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.post("/translation", async (req, res) => {
  // const { textToTranslate, outputLanguage, inputLanguage } = req.query;
  const { textToTranslate, outputLanguage, inputLanguage } = req.body;

  //New Code
  const encodedParams = new URLSearchParams();
  encodedParams.set('from', inputLanguage);
  encodedParams.set('to', outputLanguage);
  encodedParams.set('text', textToTranslate);

  const options = {
    method: 'POST',
    url: process.env.TRANSLATE_URL,
    headers: {
      'content-type': process.env.CONTENT_TYPE,
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': process.env.RAPID_API_HOST,
    },
    data: encodedParams.toString(),
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
