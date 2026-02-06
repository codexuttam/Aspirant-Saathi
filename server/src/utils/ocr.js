const Tesseract = require("tesseract.js");

async function extractTextFromImage(imagePath) {
  const result = await Tesseract.recognize(imagePath, "eng", {
    logger: () => {}, // silence logs
  });

  return result.data.text;
}

module.exports = extractTextFromImage;
