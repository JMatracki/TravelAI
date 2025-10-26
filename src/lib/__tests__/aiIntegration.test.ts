import { describe, it, expect } from "vitest";

const extractCostFromResponse = (response: string): number => {
  const patterns = [
    /\*\*Sredni koszt:\*\*\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /\*\*Mid-range:\*\*\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /Mid-range cost:\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /\*\*Total Estimated Cost:\*\*\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /Total.*Estimated.*Cost.*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /Total.*cost.*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /Estimated.*cost.*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
  ];

  for (const pattern of patterns) {
    const match = response.match(pattern);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ""));
    }
  }

  return 0;
};

const validateItineraryStructure = (content: string): boolean => {
  const hasEnglishHeaders = /#{1,3}\s*Day\s*\d+/i.test(content);
  const hasPolishHeaders = /#{1,3}\s*Dzien\s*\d+/i.test(content);
  const hasHeaders = hasEnglishHeaders || hasPolishHeaders;
  const hasActivities = /\d{2}:\d{2}/.test(content);
  const hasCosts = /\$\d+/.test(content);

  return hasHeaders && hasActivities && hasCosts;
};

describe("AI Integration Tests", () => {
  describe("Cost Extraction", () => {
    it('extracts cost from Polish AI response with "Sredni koszt"', () => {
      const mockResponse = `
## Plan Podrozy do Paryza na 3 dni

### Dzien 1: Przyjazd
- 10:00 - Przyjazd na lotnisko ($50)
- 14:00 - Zwiedzanie Wiezy Eiffla ($30)

### Dzien 2: Muzea
- 09:00 - Luwr ($25)
- 15:00 - Obiad ($40)

### SZACOWANY KOSZT PODROZY
- **Budzetowy:** $430
- **Sredni:** $630
- **Luksusowy:** $1,030

**Sredni koszt:** $630
      `;

      const extractedCost = extractCostFromResponse(mockResponse);
      expect(extractedCost).toBe(630);
    });

    it('extracts cost from English AI response with "Mid-range cost"', () => {
      const mockResponse = `
## 3-Day Paris Itinerary

### Day 1: Arrival
- 10:00 - Airport transfer ($50)
- 14:00 - Eiffel Tower visit ($30)

### Day 2: Museums
- 09:00 - Louvre Museum ($25)
- 15:00 - Lunch ($40)

### ESTIMATED TRIP COST
- **Budget:** $430
- **Mid-range:** $726.50
- **Luxury:** $1,030

**Mid-range cost:** $726.50
      `;

      const extractedCost = extractCostFromResponse(mockResponse);
      expect(extractedCost).toBe(726.5);
    });

    it("handles malformed AI response gracefully", () => {
      const malformedResponse = `
Some random text without proper structure
No costs mentioned here
Just random content
      `;

      const extractedCost = extractCostFromResponse(malformedResponse);
      expect(extractedCost).toBe(0);
    });

    it("extracts cost with comma separators", () => {
      const responseWithCommas = `
**Total Estimated Cost:** $1,250.75 per person
      `;

      const extractedCost = extractCostFromResponse(responseWithCommas);
      expect(extractedCost).toBe(1250.75);
    });
  });

  describe("Itinerary Structure Validation", () => {
    it("validates proper itinerary structure", () => {
      const validItinerary = `
## Day 1: Arrival in Tokyo
- 09:00 - Arrive at Narita Airport
- 11:00 - Check into hotel ($120)
- 14:00 - Visit Senso-ji Temple ($0)
- 18:00 - Dinner in Shibuya ($45)

## Day 2: Cultural Sites
- 08:00 - Breakfast at hotel ($15)
- 10:00 - Visit Tokyo National Museum ($25)
- 13:00 - Lunch in Harajuku ($30)
      `;

      expect(validateItineraryStructure(validItinerary)).toBe(true);
    });

    it("rejects invalid itinerary structure", () => {
      const invalidItinerary = `
Just some random text about travel
No proper day structure
No times or costs mentioned
      `;

      expect(validateItineraryStructure(invalidItinerary)).toBe(false);
    });

    it("validates itinerary with Polish structure", () => {
      const polishItinerary = `
## Dzien 1: Przyjazd do Krakowa
- 09:00 - Przyjazd na dworzec ($0)
- 11:00 - Zameldowanie w hotelu ($80)
- 14:00 - Zwiedzanie Rynku Glownego ($0)
- 18:00 - Kolacja w restauracji ($35)
      `;

      expect(validateItineraryStructure(polishItinerary)).toBe(true);
    });
  });

  describe("AI Response Edge Cases", () => {
    it("handles extremely long itineraries", () => {
      let longItinerary = "";
      for (let day = 1; day <= 30; day++) {
        longItinerary += `
## Day ${day}: Activities
- 09:00 - Morning activity ($20)
- 14:00 - Afternoon activity ($30)
- 19:00 - Evening meal ($25)
        `;
      }
      longItinerary += "\n**Total Estimated Cost:** $2,250";

      expect(validateItineraryStructure(longItinerary)).toBe(true);
      expect(extractCostFromResponse(longItinerary)).toBe(2250);
    });

    it("handles itinerary with zero costs (free activities)", () => {
      const freeItinerary = `
## Day 1: Free Activities
- 09:00 - Walk in Central Park ($0)
- 11:00 - Visit free museum ($0)
- 14:00 - Picnic lunch (bring your own) ($0)

**Total Estimated Cost:** $0
      `;

      expect(validateItineraryStructure(freeItinerary)).toBe(true);
      expect(extractCostFromResponse(freeItinerary)).toBe(0);
    });

    it("handles itinerary with high-end luxury costs", () => {
      const luxuryItinerary = `
## Day 1: Luxury Experience
- 09:00 - Private jet transfer ($5,000)
- 11:00 - 5-star hotel suite ($1,200)
- 14:00 - Michelin star lunch ($350)
- 19:00 - Private yacht dinner ($2,500)

**Total Estimated Cost:** $15,750
      `;

      expect(validateItineraryStructure(luxuryItinerary)).toBe(true);
      expect(extractCostFromResponse(luxuryItinerary)).toBe(15750);
    });
  });

  describe("Multi-language Support", () => {
    it("validates Polish day headers", () => {
      const polishHeaders = `
## Dzien 1: Warszawa
## Dzien 2: Krakow  
## Dzien 3: Gdansk
      `;

      expect(/#{1,3}\s*Dzien\s*\d+/i.test(polishHeaders)).toBe(true);
    });

    it("validates English day headers", () => {
      const englishHeaders = `
## Day 1: London
## Day 2: Edinburgh
## Day 3: Dublin
      `;

      expect(/#{1,3}\s*Day\s*\d+/i.test(englishHeaders)).toBe(true);
    });
  });
});
