function structuralParser(answerText) {
  if (!answerText) {
    return {
      intro: { present: false, score: 0 },
      body: { present: false, score: 0 },
      conclusion: { present: false, score: 0 },
      feedback: ["No answer text provided"],
    };
  }

  const paragraphs = answerText
    .split("\n")
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const totalParas = paragraphs.length;
  const feedback = [];

  /* ---------- INTRODUCTION ---------- */
  const introText = paragraphs[0] || "";
  const introKeywords = [
    "role",
    "democracy",
    "governance",
    "means",
    "refers to",
    "is defined as",
  ];

  const introScore = introKeywords.some(k =>
    introText.toLowerCase().includes(k)
  )
    ? 2
    : introText.length > 40
    ? 1
    : 0;

  if (introScore === 0) {
    feedback.push("Introduction lacks clear context or definition.");
  }

  /* ---------- BODY ---------- */
  const bodyParas = paragraphs.slice(1, totalParas - 1);
  let bodyScore = 0;

  if (bodyParas.length >= 2) bodyScore += 2;
  if (bodyParas.join(" ").length > 150) bodyScore += 2;

  if (bodyScore < 2) {
    feedback.push("Body lacks sufficient depth or multiple dimensions.");
  }

  /* ---------- CONCLUSION ---------- */
  const conclusionText = paragraphs[totalParas - 1] || "";
  const conclusionKeywords = [
    "therefore",
    "thus",
    "way forward",
    "in conclusion",
    "hence",
    "overall",
  ];

  const conclusionScore = conclusionKeywords.some(k =>
    conclusionText.toLowerCase().includes(k)
  )
    ? 2
    : conclusionText.length > 30
    ? 1
    : 0;

  if (conclusionScore === 0) {
    feedback.push("Conclusion is weak or missing a forward-looking view.");
  }

  return {
    intro: {
      present: introScore > 0,
      score: introScore,
    },
    body: {
      present: bodyScore > 0,
      score: bodyScore,
    },
    conclusion: {
      present: conclusionScore > 0,
      score: conclusionScore,
    },
    feedback,
  };
}

module.exports = structuralParser;
