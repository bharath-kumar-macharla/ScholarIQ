/**
 * AI Matching Engine
 * Calculates a match score (0-100) between a student profile and a scholarship.
 */
function calculateMatchScore(student, scholarship) {
  let score = 0;
  let maxPossible = 0;
  const matchDetails = {};

  const addScore = (key, weight, achieved) => {
    maxPossible += weight;
    const points = achieved ? weight : 0;
    score += points;
    matchDetails[key] = { points, max: weight, achieved };
  };

  // 1. GPA (Weight: 20)
  const requiredGPA = scholarship.eligibility?.minGPA || 0;
  if (requiredGPA > 0) {
    if (student.gpa >= requiredGPA) {
      addScore('gpa', 20, true);
    } else {
      addScore('gpa', 20, false);
      // Optional: penalty or immediate disqualification
    }
  }

  // 2. Field of Study / Degree (Weight: 15)
  if (scholarship.eligibility?.fields?.length > 0) {
    const isFieldMatch = scholarship.eligibility.fields.some(
      f => f.toLowerCase() === student.fieldOfStudy?.toLowerCase()
    );
    addScore('fieldOfStudy', 15, isFieldMatch);
  }

  // 3. Technical Skills (Weight: 15)
  // Calculate percentage of required skills matched
  if (scholarship.eligibility?.skills?.length > 0) {
    const studentSkills = (student.skills || []).map(s => s.toLowerCase());
    const requiredSkills = scholarship.eligibility.skills.map(s => s.toLowerCase());
    
    let matchedSkills = 0;
    requiredSkills.forEach(skill => {
      if (studentSkills.includes(skill)) matchedSkills++;
    });
    
    const skillRatio = matchedSkills / requiredSkills.length;
    maxPossible += 15;
    const points = Math.round(15 * skillRatio);
    score += points;
    matchDetails['skills'] = { points, max: 15, achieved: skillRatio === 1 };
  }

  // 4. Experiences (Weight: 30) - 5 points each
  const expChecks = [
    { req: 'requiresInternship', studentVal: 'hasInternship' },
    { req: 'requiresHackathon', studentVal: 'hasHackathon' },
    { req: 'requiresResearch', studentVal: 'hasResearch' },
    { req: 'requiresLeadership', studentVal: 'hasLeadership' },
    { req: 'requiresVolunteering', studentVal: 'hasVolunteering' },
    { req: 'requiresOpenSource', studentVal: 'hasOpenSource' },
  ];

  expChecks.forEach(({ req, studentVal }) => {
    if (scholarship.eligibility?.[req]) {
      addScore(req, 5, student[studentVal]);
    }
  });

  // 5. Demographics/Categories (Weight: 20)
  if (scholarship.eligibility?.categories?.length > 0) {
    const studentCats = (student.categories || []).map(c => c.toLowerCase());
    const reqCats = scholarship.eligibility.categories.map(c => c.toLowerCase());
    
    const isCatMatch = reqCats.some(c => studentCats.includes(c));
    addScore('category', 20, isCatMatch);
  }

  // If scholarship has absolutely no requirements, base score on student's overall completeness
  if (maxPossible === 0) {
    return {
      score: student.aiScore || 50,
      details: { base: { points: student.aiScore || 50, max: 100, achieved: true } },
      isEligible: true
    };
  }

  // Normalize to 0-100
  const finalScore = Math.round((score / maxPossible) * 100);
  
  // Hard disqualifications
  let isEligible = true;
  if (requiredGPA > 0 && student.gpa < requiredGPA) isEligible = false;

  return {
    score: finalScore,
    details: matchDetails,
    isEligible
  };
}

module.exports = { calculateMatchScore };
