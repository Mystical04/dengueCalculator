# Dengue Fluid Calculator

A React Native (Expo) app that calculates maintenance fluid requirements for **adult dengue patients**, built for use by healthcare professionals.

## What it does

1. **Select gender** — Male or Female.
2. **Enter patient info** — weight (kg) and height (cm), with range validation.
3. **View calculated values**
   - **BMI** (Body Mass Index)
   - **IBW** (Ideal Body Weight), by gender
   - **Body weight used for fluid calculation** — Actual Body Weight if BMI < 27.5, otherwise Adjusted Body Weight (ABW)
4. **Pick a fluid rate** from the available options and get the calculated fluid requirement.

All results are shown to 2 decimal places.

### Available fluid rates

- 20 cc/kg (within 15–30 minutes)
- 10, 7, 5, 3, 2, 1.5, 1.2 cc/kg/hour

### Formulas

Based on the *CPG Management of Dengue Infection in Adults (3rd Edition)*, Table 7:

```
IBW (male)   = 50.0 + 0.91 × (height cm − 152)
IBW (female) = 45.5 + 0.91 × (height cm − 152)
ABW          = IBW + 0.4 × (actual weight − IBW)

BMI < 27.5  → use Actual Body Weight for fluid calculation
BMI ≥ 27.5  → use Adjusted Body Weight (ABW) for fluid calculation
```

Formulas live in [`src/utils/calculations.ts`](src/utils/calculations.ts) and reference values in [`src/constants/clinical.ts`](src/constants/clinical.ts), so they can be updated later if the clinical guideline changes.

## Validation

- Weight: 20–300 kg
- Height: 100–250 cm

These ranges can be adjusted per the client's CPG.

## Scope

This app is a **calculator only**, for **adult dengue patients**. It is not intended for pediatric patients, other diseases, or general fluid therapy, and does not include authentication, patient records, history, PDF export, or cloud sync.

## Tech stack

- [Expo](https://expo.dev) / React Native
- [Expo Router](https://docs.expo.dev/router/introduction/) (file-based navigation)
- TypeScript

## Project structure

```
src/
  app/                Screens (index, calculator, results) + root layout
  components/          Reusable UI (buttons, inputs, selectors, result cards)
  constants/           Theme, validation ranges, fluid rate options
  types/                Shared TypeScript types
  utils/                Calculation logic (BMI / IBW / ABW / fluid volume)
```

## Getting started

```bash
npm install
npm start
```

Then press `a` (Android), `i` (iOS), or `w` (web) in the terminal, or scan the QR code with Expo Go.

## Disclaimer

For adult dengue patients only. Not a substitute for clinical judgment — always follow your institution's Clinical Practice Guideline.
