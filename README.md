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
- **Content-Security-Policy (CSP)**: Restricts resources to the same origin to mitigate XSS risks. Add this to the `<head>` of `index.html` (replace `your-username` with your GitHub username):
  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.gstatic.com https://your-username.github.io;">
  ```

## Setup and Deployment
1. **Clone Repository**:
   ```bash
   git clone https://github.com/your-username/age-calculator.git
   ```
2. **Edit Files**:
  - Update `index.html` and `script.js` as needed in IntelliJ or any editor.
  - Replace Firebase configuration in `index.html` with your project’s config.
3. **Push to GitHub**:
  - Initialize Git: `git init`
  - Add files: `git add index.html script.js README.md`
  - Commit: `git commit -m "Initial commit with Google SSO"`
  - Add remote: `git remote add origin https://github.com/your-username/age-calculator.git`
  - Push: `git push -u origin main`
4. **Enable GitHub Pages**:
  - Go to repository Settings > Pages.
  - Set Source to `main` branch, `/ (root)` folder.
  - Access the app at `https://your-username.github.io/age-calculator`.

## Usage
- Sign in with Google to access the app.
- Enter a nickname (letters only) and birthdate for each person.
- Use the slider or buttons to adjust the reference date.
- Click "Jump to Next Bday" to set the reference date to the next birthday after today.
- Click "Clear All Data" to remove all stored data.
- Ages are displayed in three columns: Infants (0-2), Toddlers (2-3), Graduation (3+).

## Security Notes
- Data is stored in `localStorage` with a user-specific key, accessible only after login.
- Avoid using real names or sensitive data, as warned in the UI.
- The CSP meta tag restricts scripts to the same origin and Firebase, reducing XSS risks.
- Authentication with Google SSO enhances access control.

## License
MIT License (or choose your own).
