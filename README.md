# Age Calculator

A lightweight web app to calculate ages based on birthdates, hosted on GitHub Pages.

## Overview
The Age Calculator allows users to:
- Add multiple people with nicknames (letters only) and birthdates.
- Calculate ages in years, months, and days, displayed in three columns: Infants (0-2, green), Toddlers (2-3, blue), Graduation (3+, red).
- Adjust the reference date via a slider (±365 days), ±1 day buttons, or manual input.
- Jump to a person’s next birthday (relative to today) with a button.
- Store data locally in the browser using `localStorage`.

## Security
- **Warning**: A notice warns users not to use real names or sensitive data, as it’s stored locally in the browser.
- **Clear Data**: A "Clear All Data" button removes all stored data from `localStorage`.
- **Content-Security-Policy (CSP)**: Restricts resources to the same origin to mitigate XSS risks. Add this to the `<head>` of `age-calculator.html`:
  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self';">
