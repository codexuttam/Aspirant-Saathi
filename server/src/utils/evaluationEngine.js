function evaluationEngine(structureAnalysis, exam = "UPSC") {
  const maxMarks = 10;

  const introScore = structureAnalysis.intro.score || 0;        // 0–2
  const bodyScore = structureAnalysis.body.score || 0;          // 0–4
  const conclusionScore = structureAnalysis.conclusion.score || 0; // 0–2

  // Normalize to UPSC rubric
  const marks = {
    introduction: introScore,                 // max 2
    body: Math.min(5, bodyScore + 1),          // body is weighted heavier
    conclusion: Math.min(3, conclusionScore + 1),
  };

  const total =
    marks.introduction +
    marks.body +
    marks.conclusion;

  // Examiner-style feedback
  const feedback = [];

  if (marks.introduction < 1)
    feedback.push("Introduction lacks clarity or definition.");

  if (marks.body < 3)
    feedback.push(
      "Body needs more depth, dimensions, and examples."
    );

  if (marks.conclusion < 2)
    feedback.push(
      "Conclusion should be more forward-looking with a way forward."
    );

  if (feedback.length === 0)
    feedback.push("Well-structured answer with balanced coverage.");

  return {
    maxMarks,
    totalMarks: Math.min(total, maxMarks),
    breakup: marks,
    feedback,
  };
}

module.exports = evaluationEngine;
