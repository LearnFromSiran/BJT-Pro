# BJT-Pro

BJT Pro - Business Japanese Language Learning App

## Overview

BJT Pro is a comprehensive mobile application designed to help learners master Business Japanese, prepare for the Business Japanese Proficiency Test (BJT), and develop professional communication skills for the Japanese corporate workplace.

## Features

- **Keigo Mastery** - Learn Sonkeigo (respectful), Kenjougo (humble), and Teineigo (polite) forms
- **BJT Mock Tests** - Practice questions modeled after the actual BJT exam
- **Business Communication** - Templates for emails, phone calls, and meetings
- **Cultural Context** - Japanese corporate etiquette and business culture lessons
- **Progress Tracking** - Monitor your learning journey and test scores

## Tech Stack

- **Frontend**: React Native (0.76) with Expo SDK 52
- **Language**: JavaScript
- **Navigation**: Expo Router (file-based)
- **Design system**: Custom theme (`src/theme`)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:

```bash
git clone https://github.com/LearnFromSiran/BJT-Pro.git
cd BJT-Pro
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npx expo start
```

4. Run on your device or emulator

## Project Structure

```
BJT-Pro/
├── app/                  # Expo Router screens (file-based routing)
│   ├── _layout.js        # Root stack navigator
│   ├── index.js          # Home dashboard
│   ├── keigo.js          # Keigo Mastery
│   ├── mock-test.js      # Interactive BJT mock test
│   ├── business.js       # Business communication templates
│   └── culture.js        # Cultural context
├── src/
│   ├── components/       # Reusable UI (Card, ScreenHeader)
│   ├── data/            # Learning content
│   └── theme/           # Design system (colors, spacing, typography)
├── assets/              # Icon, splash, adaptive icon, favicon
├── app.json            # Expo app config
├── eas.json            # EAS build/submit profiles
├── DEPLOYMENT.md       # Android build & Play Store guide
└── README.md
```

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full Android build and Google
Play publishing guide (signed AAB/APK, keystore, EAS, and manual steps).

## License

MIT License

## Author

LearnFromSiran
