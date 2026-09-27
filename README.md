# Langihan Integrated Bus Terminal (LIBT) - Butuan City
### Thesis & Demo Booking System (100% Offline Standalone - No Localhost Needed)

---

## 🌟 OPTION 1: 1-CLICK RUN (Easiest - No Localhost, No Installation)

You do **NOT** need Node.js, terminal, or any command line!

1. Extract this ZIP folder.
2. Find the file named:
   👉 **`DOUBLE-CLICK-TO-RUN.html`**
3. **Double-click it** to open directly in Google Chrome, Microsoft Edge, Safari, or Firefox.
4. That's it! The entire booking system, seat selector, live dispatch board, and route map will work immediately, 100% offline.

---

## 🛠️ OPTION 2: Run via Localhost (For Developers / Source Code Editing)

If you want to edit the React TypeScript source code or run via localhost:

1. Make sure you have **Node.js** installed (from [nodejs.org](https://nodejs.org/)).
2. Open terminal in this folder and run:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## 📦 What's Included in This Package
- **`DOUBLE-CLICK-TO-RUN.html`**: The complete standalone offline application bundled into a single file with all styles, icons, and bus images embedded.
- **`src/`**: Full React + TypeScript source code:
  - `components/BookingForm.tsx` (Route and trip scheduling)
  - `components/SeatSelector.tsx` (Interactive 2x2 coach & UV Express layout)
  - `components/PassengerDetails.tsx` (Senior/PWD/Student 20% discount system)
  - `components/SummaryTicket.tsx` (Boarding pass with printable QR code)
  - `components/RouteMapVisualizer.tsx` (Dark-mode Caraga & Davao navigation map)
  - `components/LiveDispatchBoard.tsx` (Real-time departure FIDS)
  - `components/TerminalMap.tsx` (Terminal bays & passenger amenities layout)
  - `components/WeatherHeroAnchor.tsx` (Environmental ergonomics & dynamic clock banner)
  - `data/scheduleData.ts` (Bus lines, provincial routes, and local ticket storage)
- **`public/`**: Assets and offline files.

---

## 🛡️ Privacy & Academic Demo Notice
- Zero API keys or tokens required.
- Zero external billing or cloud charges.
- All booked tickets are stored safely in your browser's offline storage (`localStorage`).
