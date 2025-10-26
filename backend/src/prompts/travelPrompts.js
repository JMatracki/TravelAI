const COST_SUMMARY_TEMPLATES = {
  en: `### ESTIMATED TRIP COST
- **Budget:** $XXX
- **Mid-range:** $YYY  
- **Luxury:** $ZZZ

**Mid-range cost:** $YYY`,
  pl: `### SZACOWANY KOSZT PODROZY
- **Budzetowy:** $XXX
- **Sredni:** $YYY  
- **Luksusowy:** $ZZZ

**Sredni koszt:** $YYY`,
};

const PROMPT_SECTIONS = {
  en: {
    accommodation: `**ACCOMMODATION:**
- Hotel/hostel recommendations with specific prices per night
- Include budget, mid-range, and luxury options
- Mention if breakfast is included`,

    transportation: `**TRANSPORTATION:**
- Airport transfers (arrival and departure) with costs
- Inter-city transportation (flights, trains, buses) with prices
- Local transportation (metro, buses, taxis, ride-share) with daily costs
- Car rental options if applicable`,

    activities: `**ACTIVITIES & ATTRACTIONS:**
- Entry fees for museums, monuments, parks
- Tour costs (guided tours, day trips)
- Activity prices (adventure sports, cultural experiences)
- Entertainment costs (shows, concerts, clubs)`,

    food: `**FOOD & DINING:**
- Breakfast, lunch, dinner costs per meal
- Local specialties and restaurant recommendations
- Street food and budget dining options
- Drinks and nightlife expenses`,

    additional: `**ADDITIONAL COSTS:**
- Travel insurance recommendations
- Visa fees if applicable
- Shopping and souvenir budgets
- Tips and service charges
- Emergency fund suggestions`,

    format: `**FORMAT REQUIREMENTS:**
- Include specific dollar amounts for EVERY cost mentioned
- Provide cost ranges when appropriate (e.g., $15-$25)
- Calculate approximate daily budgets
- Suggest total trip budget ranges
- Include money-saving tips and free activities`,
  },

  pl: {
    accommodation: `**ZAKWATEROWANIE:**
- Rekomendacje hoteli/hosteli z konkretnymi cenami za noc
- Uwzglednij opcje budzetowe, srednie i luksusowe
- Wspomnij czy sniadanie jest wliczone`,

    transportation: `**TRANSPORT:**
- Transfery z/na lotnisko z kosztami
- Transport miedzy miastami (loty, pociagi, autobusy) z cenami
- Transport lokalny (metro, autobusy, taksowki, ride-share) z dziennymi kosztami
- Opcje wynajmu samochodu jesli dotyczy`,

    activities: `**ATRAKCJE I AKTYWNOSCI:**
- Oplaty za wstep do muzeow, zabytkow, parkow
- Koszty wycieczek (wycieczki z przewodnikiem, wycieczki jednodniowe)
- Ceny aktywnosci (sporty ekstremalne, doswiadczenia kulturalne)
- Koszty rozrywki (spektakle, koncerty, kluby)`,

    food: `**JEDZENIE I RESTAURACJE:**
- Koszty sniadania, obiadu, kolacji za posilek
- Specjalnosci lokalne i rekomendacje restauracji
- Jedzenie uliczne i opcje budzetowe
- Napoje i wydatki na zycie nocne`,

    additional: `**DODATKOWE KOSZTY:**
- Rekomendacje ubezpieczenia podroznego
- Oplaty wizowe jesli dotyczy
- Budzety na zakupy i pamiatki
- Napiwki i oplaty serwisowe
- Sugestie funduszu awaryjnego`,

    format: `**WYMAGANIA FORMATOWANIA:**
- Uwzglednij konkretne kwoty w dolarach dla KAZDEGO wspomnianego kosztu
- Podaj zakresy cenowe gdy odpowiednie (np. $15-$25)
- Oblicz przyblizone dzienne budzety
- Zaproponuj zakresy calkowitego budzetu podrozy
- Uwzglednij wskazowki oszczednosciowe i darmowe aktywnosci`,
  },
};

/**
 * Generate travel itinerary prompt for a specific language
 * @param {string} destination - Travel destination
 * @param {number} days - Number of days
 * @param {string} activities - User's preferred activities
 * @param {string} language - Language code ('en' or 'pl')
 * @returns {Object} Prompt and system prompt
 */
export const generateTravelPrompt = (
  destination,
  days,
  activities,
  language
) => {
  const sections = PROMPT_SECTIONS[language];
  const costTemplate = COST_SUMMARY_TEMPLATES[language];

  const isPolish = language === "pl";

  const mainPrompt = isPolish
    ? `Stworz szczegolowy plan podrozy do ${destination} na ${days} dni.

Zainteresowania i preferencje uzytkownika: ${activities}

Prosze przygotowac szczegolowy plan podrozy zawierajacy WSZYSTKIE koszty podrozy:`
    : `Create a comprehensive travel itinerary for ${destination} for ${days} days.

User's interests and preferences: ${activities}

Please provide a detailed itinerary that includes ALL travel costs:`;

  const promptSections = [
    sections.accommodation,
    sections.transportation,
    sections.activities,
    sections.food,
    sections.additional,
    sections.format,
  ].join("\n\n");

  const mandatorySummary = isPolish
    ? `**OBOWIAZKOWE PODSUMOWANIE NA KONCU:**
Na samym koncu planu podrozy MUSISZ dodac dokladnie w tym formacie:`
    : `**MANDATORY SUMMARY AT THE END:**
At the very end of the travel plan you MUST add exactly in this format:`;

  const focusNote = isPolish
    ? `Skup sie na aktywnosciach pasujacych do: ${activities}
Uczyn to praktycznym i swiadomym budzetu z realistycznymi cenami dla ${destination}.`
    : `Focus on activities that match: ${activities}
Make it practical and budget-conscious with realistic pricing for ${destination}.`;

  const prompt = `${mainPrompt}

${promptSections}

${mandatorySummary}

${costTemplate}

${focusNote}`;

  const systemPrompt = isPolish
    ? `Jestes profesjonalnym planista podrozy z rozlegla wiedza o destynacjach na calym swiecie. Twoz szczegolowe, praktyczne i angazujace plany podrozy dostosowane do zainteresowan i preferencji kazdego podroznika.

WAZNE: Uzywaj tylko podstawowych znakow ASCII - nie uzywaj polskich znakow diakrytycznych (ą, ć, ę, ł, ń, ó, ś, ź, ż). Zastap je odpowiednimi znakami podstawowymi (a, c, e, l, n, o, s, z, z).

Kluczowe wymagania:
- Zawsze dostosowuj rekomendacje do konkretnych zainteresowan i aktywnosci uzytkownika
- Dostarczaj praktyczne, wykonalne porady z REALISTYCZNYMI cenami
- Uwzgledniaj lokalne spostrzezenia i wskazowki kulturalne
- Rozwaz dlugosc pobytu (${days} dni) przy planowaniu aktywnosci
- Skup sie na destynacji: ${destination}
- Priorytetowo traktuj aktywnosci pasujace do: ${activities}
- ZAWSZE uwzgledniaj konkretne kwoty w dolarach dla kazdego wspomnianego kosztu
- Dostarczaj dokladne, aktualne ceny dla zakwaterowania, transportu, aktywnosci i jedzenia
- Uwzgledniaj podzialy budzetowe i szacunki calkowitych kosztow podrozy
- Sugeruj alternatywy oszczednosciowe i darmowe aktywnosci

Uczyn plan osobistym i istotnym dla ich konkretnego stylu podrozowania i zainteresowan, bedac jednoczesnie finansowo dokladnym i kompleksowym.`
    : `You are a professional travel planner with extensive knowledge of destinations worldwide. Create detailed, practical, and engaging travel itineraries that are personalized to each traveler's interests and preferences.

Key requirements:
- Always tailor recommendations to the user's specific interests and activities
- Provide practical, actionable advice with REALISTIC pricing
- Include local insights and cultural tips
- Consider the duration of stay (${days} days) when planning activities
- Focus on the destination: ${destination}
- Prioritize activities that match: ${activities}
- ALWAYS include specific dollar amounts for every cost mentioned
- Provide accurate, up-to-date pricing for accommodations, transportation, activities, and dining
- Include budget breakdowns and total trip cost estimates
- Suggest money-saving alternatives and free activities

Make the itinerary feel personal and relevant to their specific travel style and interests while being financially accurate and comprehensive.`;

  return { prompt, systemPrompt };
};
