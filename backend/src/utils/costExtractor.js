const COST_PATTERNS = {
  SREDNI_KOSZT: /\*\*sredni koszt:\*\*\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,

  MID_RANGE_COST: /\*\*mid-range cost:\*\*\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,

  BUDGET_CATEGORIES: [
    /\*\*budzetowy:\*\*\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /\*\*sredni:\*\*\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /\*\*luksusowy:\*\*\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /\*\*budget:\*\*\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /\*\*mid.*?range:\*\*\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /\*\*luxury:\*\*\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
  ],
};

/**
 * Extract numeric value from currency string
 * @param {string} costString - String containing cost (e.g., "$1,500.00")
 * @returns {number} Parsed cost as number
 */
const parseCostString = (costString) => {
  if (!costString) return 0;

  const match = costString.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  if (!match) return 0;

  const cost = parseFloat(match[1].replace(/,/g, ""));
  return isNaN(cost) ? 0 : cost;
};

/**
 * Find costs using a specific pattern
 * @param {string} content - Text content to search
 * @param {RegExp} pattern - Regular expression pattern
 * @returns {number[]} Array of found costs
 */
const findCostsWithPattern = (content, pattern) => {
  const matches = content.match(pattern);
  if (!matches) return [];

  return matches
    .map(parseCostString)
    .filter((cost) => cost > 0 && cost < 10000); // Reasonable cost range
};

/**
 * Extract the main trip cost from AI response content
 * Strategy: Look for specific cost summary patterns first, then fall back to budget categories
 *
 * @param {string} content - AI response content
 * @returns {number} Extracted cost (0 if not found)
 */
export const extractTripCost = (content) => {
  if (!content || typeof content !== "string") {
    return 0;
  }

  const sredniKoszt = findCostsWithPattern(content, COST_PATTERNS.SREDNI_KOSZT);
  if (sredniKoszt.length > 0) {
    return Math.round(sredniKoszt[0]);
  }

  const midRangeCost = findCostsWithPattern(
    content,
    COST_PATTERNS.MID_RANGE_COST
  );
  if (midRangeCost.length > 0) {
    return Math.round(midRangeCost[0]);
  }

  const allFoundCosts = [];

  for (const pattern of COST_PATTERNS.BUDGET_CATEGORIES) {
    const costs = findCostsWithPattern(content, pattern);
    allFoundCosts.push(...costs);
  }

  if (allFoundCosts.length === 0) {
    return 0;
  }

  allFoundCosts.sort((a, b) => a - b);
  const medianCost = allFoundCosts[Math.floor(allFoundCosts.length / 2)];

  return Math.round(medianCost);
};
