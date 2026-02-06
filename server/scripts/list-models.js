const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
(async () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const models = await genAI.listModels();
  console.log(models);
})();