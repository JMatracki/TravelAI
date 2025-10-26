# 🌍 AI Travel Itinerary Planner

![Travel Planner](https://img.shields.io/badge/AI%20Travel-Planner-blue?style=for-the-badge&logo=airplane&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)

**Inteligentny generator planów podróży napędzany sztuczną inteligencją**

[🚀 Demo](#-demo) • [📚 Dokumentacja](#-features) • [🛠️ Instalacja](#-installation--setup) • [🤝 Współpraca](#-contributing)

## ✨ Czym jest AI Travel Planner?

Nowoczesna aplikacja webowa, która wykorzystuje moc sztucznej inteligencji OpenAI do generowania **spersonalizowanych planów podróży**. Aplikacja analizuje Twoje preferencje, budżet i zainteresowania, aby stworzyć szczegółowy itinerarium z realistycznymi kosztami.

## 🚀 Demo

**[🌐 Zobacz demo na żywo](https://cerulean-kulfi-23ee0f.netlify.app/)**

> ⚠️ **Uwaga**: Demo prezentuje jedynie wygląd aplikacji (frontend). Funkcjonalność generowania planów podróży z AI nie działa, ponieważ środowisko Netlify nie obsługuje backendu Node.js. Aby w pełni przetestować aplikację, zainstaluj ją lokalnie zgodnie z instrukcjami poniżej.

### 📸 Screenshot aplikacji

![AI Travel Planner - Pełna funkcjonalność](https://s6.imgcdn.dev/Yy2gbC.png)

_Aplikacja w akcji: generowanie spersonalizowanego planu podróży dla Paryża z AI, zapisywanie itinerariów i eksport do PDF_

### 🎯 Główne funkcje

- 🤖 **AI-powered Planning** - GPT-4o-mini generuje szczegółowe plany podróży
- 💰 **Precyzyjne kosztorysy** - Realistyczne ceny dla każdego elementu podróży
- 🌐 **Wielojęzyczność** - Pełne wsparcie dla języka polskiego i angielskiego
- 📱 **Responsive Design** - Idealne działanie na desktop i mobile
- 🌙 **Dark/Light Mode** - Przełączanie motywów
- 📄 **PDF Export** - Pobieranie itinerariów w formacie PDF (jsPDF)
- 💾 **Local Storage** - Zapisywanie i zarządzanie wieloma planami
- 🎨 **Modern UI** - Piękny interfejs z Tailwind CSS i Radix UI
- 🔄 **Smart Caching** - TanStack Query dla optymalnej wydajności
- 🎯 **Type Safety** - Pełna integracja TypeScript ze strict mode
- 🧪 **Well Tested** - Kompleksowe testy z Vitest i Testing Library

---

## 🚀 Quick Start

### 📋 Wymagania

- **Node.js** v18+
- **npm** lub **yarn**
- **Klucz API OpenAI** ([Uzyskaj tutaj](https://platform.openai.com/api-keys))

### ⚡ Instalacja w 4 krokach

- **Sklonuj repozytorium**

  ```bash
  git clone https://github.com/jmatracki/AI-Travel-Itinerary-Planner.git
  cd AI-Travel-Itinerary-Planner
  ```

- **Zainstaluj wszystkie zależności**

  ```bash
  npm run install:all
  ```

- **Skonfiguruj zmienne środowiskowe**

  Stwórz plik `backend/.env`:

  ```env
  OPENAI_API_KEY=sk-your-openai-api-key-here
  PORT=3001
  FRONTEND_URL=http://localhost:5173
  NODE_ENV=development
  ```

  > ⚠️ **WAŻNE**: Bez klucza API pobranego z OpenAI generowanie podróży nie będzie działać!

- **Uruchom aplikację**
  ```bash
  npm run dev
  ```
  🎉 **Gotowe!** Aplikacja działa na:
  - Frontend: `http://localhost:5173`
  - Backend API: `http://localhost:3001`

---

## 🛠️ Architektura techniczna

### 🎨 Frontend Stack

| Technologia          | Wersja | Zastosowanie                                           |
| -------------------- | ------ | ------------------------------------------------------ |
| **React**            | 18     | Biblioteka UI z hooks i concurrent features            |
| **TypeScript**       | 5.8+   | Type-safe development ze strict config                 |
| **Vite**             | 5.4+   | Szybki bundler i dev server                            |
| **Tailwind CSS**     | 3.4+   | Utility-first styling framework                        |
| **React Router Dom** | 6.30+  | Client-side routing i nawigacja                        |
| **TanStack Query**   | 5.83+  | Server state management i caching                      |
| **Radix UI**         | 1.0+   | Accessible UI primitives (Label, Toast, Tooltip, Slot) |
| **Lucide React**     | 0.462+ | Beautiful SVG icon library                             |
| **Sonner**           | 1.7+   | Elegant toast notifications                            |
| **jsPDF**            | 3.0+   | Generowanie dokumentów PDF                             |

### ⚙️ Backend Stack

| Technologia            | Wersja | Zastosowanie                                |
| ---------------------- | ------ | ------------------------------------------- |
| **Node.js**            | 18+    | JavaScript runtime environment              |
| **Express**            | 4.18+  | Web framework z middleware                  |
| **OpenAI API**         | 4.20+  | AI-powered content generation (GPT-4o-mini) |
| **Helmet**             | 7.1+   | Security headers middleware                 |
| **CORS**               | 2.8+   | Cross-origin resource sharing               |
| **Express Rate Limit** | 7.1+   | API abuse prevention                        |
| **Dotenv**             | 17.2+  | Environment variable management             |

### 🧪 Development & Testing Stack

| Technologia           | Wersja | Zastosowanie                      |
| --------------------- | ------ | --------------------------------- |
| **Vitest**            | 4.0+   | Unit testing framework            |
| **Testing Library**   | 16.3+  | React component testing utilities |
| **ESLint**            | 9.32+  | Code linting i quality checks     |
| **Prettier**          | 3.6+   | Code formatting                   |
| **Husky**             | 9.1+   | Git hooks automation              |
| **TypeScript ESLint** | 8.38+  | TypeScript-specific linting       |

---

## 📁 Struktura projektu

```
🏗️ AI-Travel-Itinerary-Planner/
├── 📂 src/                           # Frontend React application
│   ├── 📂 components/               # Reusable UI components
│   │   ├── 📂 common/              # Common components (Hero, ErrorBoundary)
│   │   ├── 📂 layout/              # Layout components (Header, Footer)
│   │   ├── 📂 trip/                # Trip-specific components
│   │   │   ├── 📄 TripPlanningForm.tsx # Main planning form
│   │   │   ├── 📄 ItineraryResults.tsx # Results display component
│   │   │   └── 📄 SavedItineraries.tsx # Saved plans management
│   │   └── 📂 ui/                  # Base UI components (Button, Input, etc.)
│   ├── 📂 hooks/                   # Custom React hooks
│   │   ├── 📄 useItinerary.ts      # Main itinerary logic
│   │   ├── 📄 useSavedItineraries.ts # Saved itineraries management
│   │   ├── 📄 useScrollToSection.ts # Smooth scrolling utility
│   │   ├── 📄 useDebounce.ts       # Input debouncing
│   │   ├── 📄 useTheme.ts          # Theme management
│   │   └── 📄 useLanguage.ts       # Language switching
│   ├── 📂 lib/                     # Core utilities & services
│   │   ├── 📂 api/                 # API services
│   │   │   └── 📄 apiService.ts    # HTTP client for backend
│   │   ├── 📂 config/              # Configuration
│   │   │   └── 📄 constants.ts     # App constants & settings
│   │   ├── 📂 query/               # React Query setup
│   │   │   └── 📄 queryClient.ts   # TanStack Query configuration
│   │   └── 📂 storage/             # LocalStorage management
│   │       ├── 📄 itinerary.ts     # Itinerary storage logic
│   │       ├── 📄 preferences.ts   # User preferences storage
│   │       └── 📄 index.ts         # Storage utilities export
│   ├── 📂 translations/            # Internationalization
│   │   ├── 📄 en.ts                # English translations
│   │   ├── 📄 pl.ts                # Polish translations
│   │   └── 📄 translations.ts      # Main translations export
│   ├── 📂 contexts/                # React Context providers
│   ├── 📂 types/                   # TypeScript type definitions
│   ├── 📂 utils/                   # General utilities
│   │   └── 📄 utils.ts             # Helper functions (cn, etc.)
│   └── 📂 providers/               # Context providers setup
├── 📂 backend/                      # Node.js Express server
│   ├── 📂 src/
│   │   ├── 📂 services/            # Business logic services
│   │   │   └── 📄 openaiService.js # AI integration (refactored!)
│   │   ├── 📂 prompts/             # AI prompt templates
│   │   │   └── 📄 travelPrompts.js # Multilingual prompt generation
│   │   ├── 📂 utils/               # Backend utilities
│   │   │   ├── 📄 validation.js    # Input validation & sanitization
│   │   │   └── 📄 costExtractor.js # Cost parsing from AI responses
│   │   ├── 📄 server.js            # Express server setup
│   │   └── 📄 config.js            # Environment configuration
│   └── 📄 package.json             # Backend dependencies
├── 📄 package.json                  # Frontend deps & npm scripts
└── 📄 README.md                     # This file
```

---

## 🔒 Bezpieczeństwo i wydajność

### 🛡️ Funkcje bezpieczeństwa

- ✅ **Klucze API** bezpiecznie przechowane w zmiennych środowiskowych
- ✅ **Rate Limiting** - 10 requestów na 15 minut per IP
- ✅ **CORS** konfiguracja z whitelistą domen
- ✅ **Helmet** - bezpieczne nagłówki HTTP
- ✅ **Input Validation** - sanityzacja i walidacja danych
- ✅ **Error Handling** - bezpieczne komunikaty błędów

### ⚡ Optymalizacje wydajności

- ✅ **Debounced Requests** - 500ms opóźnienie dla inputów
- ✅ **Request Cancellation** - anulowanie przy unmount komponentów
- ✅ **React.memo** - optymalizacja re-renderów
- ✅ **Code Splitting** - lazy loading komponentów
- ✅ **Efficient State Management** - custom hooks pattern

---

## 🌐 API Endpoints

| Method | Endpoint                  | Opis                      |
| ------ | ------------------------- | ------------------------- |
| `GET`  | `/api/health`             | Health check serwera      |
| `POST` | `/api/generate-itinerary` | Generowanie planu podróży |

### 📝 Przykład request/response

**Request:**

```json
{
  "destination": "Tokyo, Japan",
  "days": 7,
  "activities": "temples, sushi, shopping, nightlife",
  "language": "en"
}
```

**Response:**

```json
{
  "id": "itinerary_1698765432_abc123def",
  "destination": "Tokyo, Japan",
  "days": 7,
  "content": "# 7-Day Tokyo Itinerary\n\n## Day 1...",
  "estimatedCost": 2150,
  "createdAt": "2023-10-31T12:30:45.123Z"
}
```

---

## 🚀 Dostępne komendy

```bash
# 🏃‍♂️ Development
npm run dev              # Uruchom frontend + backend
npm run dev:frontend     # Tylko frontend (Vite)
npm run dev:backend      # Tylko backend (Nodemon)

# 📦 Dependencies
npm run install:all      # Zainstaluj wszystkie zależności

# 🏗️ Production
npm run build           # Build aplikacji na produkcję
npm run start           # Uruchom prod build

# 🔍 Code Quality
npm run lint            # ESLint check
npm run lint:fix        # Auto-fix linting issues
npm run type-check      # TypeScript validation

# 🧪 Testing
npm run test            # Run test suite
npm run test:watch      # Tests w trybie watch
npm run test:coverage   # Coverage report
```

---

## 🌍 Konfiguracja środowisk

### 🔧 Backend Environment (.env)

```bash
# 🤖 OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here  # WYMAGANE!
OPENAI_MODEL=gpt-4o-mini                     # Model AI (opcjonalne)

# 🌐 Server Configuration
PORT=3001                                    # Port serwera
FRONTEND_URL=http://localhost:5173           # CORS whitelist
NODE_ENV=development                         # Environment

# 🛡️ Security (opcjonalne)
RATE_LIMIT_WINDOW_MS=900000                 # 15 minut
RATE_LIMIT_MAX_REQUESTS=10                  # Max requests
```

### ⚛️ Frontend Environment (.env.local)

```bash
# 📡 API Configuration
VITE_API_URL=http://localhost:3001/api

# 🐛 Development
VITE_DEBUG=false
VITE_NODE_ENV=development
```

---

## 🧪 Testowanie

Projekt zawiera komprehensywną suite testów:

```bash
# Uruchom wszystkie testy
npm run test

# Testy z coverage
npm run test:coverage

# Testy w trybie watch
npm run test:watch
```

**Pokrycie testów:**

- ✅ Unit testy dla wszystkich hooks
- ✅ Integration testy dla komponentów
- ✅ API endpoint testing
- ✅ Validation logic tests

---

## 🤝 Contributing

Chcesz pomóc w rozwoju projektu? Świetnie! 🎉

### 🔄 Proces contribution

- **Fork** repozytorium
- Stwórz branch feature (`git checkout -b feature/amazing-feature`)
- Commit zmiany (`git commit -m 'Add amazing feature'`)
- Push na branch (`git push origin feature/amazing-feature`)
- Otwórz **Pull Request**

### 📋 Guidelines

- Używaj **conventional commits** (feat:, fix:, docs:)
- Pisz testy dla nowych funkcji
- Utrzymuj **TypeScript strict mode**
- Dbaj o **ESLint** configuration
- Zaktualizuj dokumentację jeśli potrzeba

---

## 📄 Licencja

Ten projekt jest dostępny na licencji **MIT License**

```
MIT License - możesz swobodnie używać, modyfikować i dystrybuować ten kod.
```

---

## 🙏 Podziękowania

### 💫 Główni współtwórcy

- **[JMatracki](https://github.com/jmatracki)** - Lead Developer & Project Creator

### 🛠️ Technologie i społeczności

- **[OpenAI](https://openai.com)**
- **[React Team](https://react.dev)**
- **[Vercel](https://vercel.com)**
- **[Tailwind CSS](https://tailwindcss.com)**
- **[TypeScript](https://typescriptlang.org)**

#

**⭐ Jeśli projekt Ci się podoba, zostaw gwiazdkę! ⭐**
