import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';

let birthdates = []; // Array to hold { nickname, birthdate } objects
let userId = null;

// Get the Firebase app instance and auth
const app = getApp();
const auth = getAuth(app);

// Wait for Firebase auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
        loadApp();
    }
});

function loadApp() {
    // Load saved birthdates
    const saved = localStorage.getItem(`ageCalculatorBirthdates_${userId}`);
    if (saved) {
        birthdates = JSON.parse(saved).filter(entry => entry.birthdate);
    }
    if (birthdates.length === 0) {
        addEntry(); // Start with one empty entry
    } else {
        birthdates.forEach(entry => addEntry(entry.birthdate, entry.nickname)); // Restore saved
    }

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('referenceDate').value = today;

    // Initial calculation
    calculateAges();

    // Event listeners
    document.getElementById('referenceDate').addEventListener('change', calculateAges);
    document.getElementById('dateSlider').addEventListener('input', updateReferenceDate);
}

// Function to add a new entry (with optional pre-filled date and nickname)
function addEntry(preFillDate = '', preFillNickname = '') {
    const container = document.getElementById('entriesContainer');
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry';
    entryDiv.innerHTML = `
        <label>Nickname (letters only):</label>
        <input type="text" value="${preFillNickname}" pattern="[A-Za-z]+" title="Only letters allowed" onchange="saveAndCalculate()">
        <label>Birthdate:</label>
        <div class="birthdate-row">
            <input type="date" value="${preFillDate}" onchange="saveAndCalculate()">
            <button class="jump-btn" onclick="jumpToNextBirthday(this)">Jump to Next Bday</button>
        </div>
        <div style="display: flex; gap: 5px; margin: 5px 0;">
            <button class="hide-btn" onclick="toggleHideEntry(this)">Hide</button>
            <button class="remove-btn" onclick="removeEntry(this)">X</button>
        </div>
        <div class="age-for-entry">Age: --</div>
    `;
    container.appendChild(entryDiv);

    // Update birthdates array
    const nicknameInput = entryDiv.querySelector('input[type="text"]');
    const dateInput = entryDiv.querySelector('input[type="date"]');
    birthdates.push({ nickname: nicknameInput.value, birthdate: dateInput.value, hidden: false });
    saveBirthdates();
    calculateAges();
}

// Make addEntry available globally
window.addEntry = addEntry;

// Function to remove an entry
function removeEntry(button) {
    const entryDiv = button.closest('.entry');
    const nicknameInput = entryDiv.querySelector('input[type="text"]').value;
    const dateInput = entryDiv.querySelector('input[type="date"]').value;
    const index = birthdates.findIndex(entry => entry.birthdate === dateInput && entry.nickname === nicknameInput);
    if (index > -1) {
        birthdates.splice(index, 1);
    }
    entryDiv.remove();
    saveBirthdates();
    calculateAges();
}

// Save birthdates to localStorage
function saveBirthdates() {
    const entries = document.querySelectorAll('.entry');
    birthdates = Array.from(entries).map(entry => {
        const nicknameInput = entry.querySelector('input[type="text"]').value;
        const dateInput = entry.querySelector('input[type="date"]').value;
        return { nickname: nicknameInput.match(/^[A-Za-z]+$/) ? nicknameInput : '', birthdate: dateInput };
    }).filter(entry => entry.birthdate);
    localStorage.setItem(`ageCalculatorBirthdates_${userId}`, JSON.stringify(birthdates));
}

// Wrapper to save and calculate on input change
function saveAndCalculate() {
    saveBirthdates();
    calculateAges();
}

// Make functions available globally for HTML onclick handlers (moved here for early availability)
window.saveAndCalculate = saveAndCalculate;

// Function to clear all data
function clearAllData() {
    localStorage.removeItem(`ageCalculatorBirthdates_${userId}`);
    location.reload();
}

// Function to step date by delta days
function stepDate(delta) {
    const slider = document.getElementById('dateSlider');
    const currentValue = parseInt(slider.value);
    const newValue = Math.max(slider.min, Math.min(slider.max, currentValue + delta));
    slider.value = newValue;
    updateReferenceDate();
}

// Function to reset reference date to today
function resetToToday() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('referenceDate').value = today;
    
    // Reset slider to 0 (today)
    const slider = document.getElementById('dateSlider');
    slider.value = 0;
    document.getElementById('sliderValue').textContent = '0 days (today)';
    
    // Recalculate ages
    calculateAges();
}

// Function to toggle hide/show for an entry
function toggleHideEntry(button) {
    const entryDiv = button.closest('.entry');
    const nicknameInput = entryDiv.querySelector('input[type="text"]').value;
    const dateInput = entryDiv.querySelector('input[type="date"]').value;
    
    // Find the entry in birthdates array
    const entryIndex = birthdates.findIndex(entry => 
        entry.nickname === nicknameInput && entry.birthdate === dateInput
    );
    
    if (entryIndex > -1) {
        // Toggle hidden state
        birthdates[entryIndex].hidden = !birthdates[entryIndex].hidden;
        
        // Update button text and entry appearance
        if (birthdates[entryIndex].hidden) {
            button.textContent = 'Show';
            entryDiv.style.opacity = '0.5';
            entryDiv.style.textDecoration = 'line-through';
        } else {
            button.textContent = 'Hide';
            entryDiv.style.opacity = '1';
            entryDiv.style.textDecoration = 'none';
        }
        
        // Save and recalculate
        saveBirthdates();
        calculateAges();
    }
}

// Function to jump to the next birthday
function jumpToNextBirthday(button) {
    const entryDiv = button.closest('.entry');
    const birthdateInput = entryDiv.querySelector('input[type="date"]').value;
    if (!birthdateInput) return;

    const birthDate = new Date(birthdateInput + 'T00:00:00');
    const today = new Date();

    let nextBdayYear = today.getFullYear();
    if (
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
    ) {
        nextBdayYear++;
    }

    const nextBirthday = new Date(nextBdayYear, birthDate.getMonth(), birthDate.getDate());
    const year = nextBirthday.getFullYear();
    const month = String(nextBirthday.getMonth() + 1).padStart(2, '0');
    const day = String(nextBirthday.getDate()).padStart(2, '0');
    const newDate = `${year}-${month}-${day}`;

    document.getElementById('referenceDate').value = newDate;
    const diffDays = Math.round((nextBirthday - today) / (1000 * 60 * 60 * 24));
    const slider = document.getElementById('dateSlider');
    slider.value = Math.max(slider.min, Math.min(slider.max, diffDays));
    document.getElementById('sliderValue').textContent = `${diffDays} days from today`;

    calculateAges();
}

// Function to update reference date based on slider
function updateReferenceDate() {
    const slider = document.getElementById('dateSlider');
    const offsetDays = parseInt(slider.value);
    const today = new Date();
    const referenceDate = new Date(today);
    referenceDate.setDate(today.getDate() + offsetDays);

    const year = referenceDate.getFullYear();
    const month = String(referenceDate.getMonth() + 1).padStart(2, '0');
    const day = String(referenceDate.getDate()).padStart(2, '0');
    const newDate = `${year}-${month}-${day}`;

    document.getElementById('referenceDate').value = newDate;
    document.getElementById('sliderValue').textContent = `${offsetDays} days from today`;

    calculateAges();
}

// Function to calculate ages for all entries
function calculateAges() {
    const referenceDateInput = document.getElementById('referenceDate').value;
    if (!referenceDateInput) {
        updateGlobalDisplay(['', '', ''], true);
        return;
    }

    const referenceDate = new Date(referenceDateInput + 'T00:00:00');
    const entries = document.querySelectorAll('.entry');
    let age0to2 = '<ul>';
    let age2to3 = '<ul>';
    let age3plus = '<ul>';

    entries.forEach((entry, index) => {
        const nicknameInput = entry.querySelector('input[type="text"]').value;
        const birthdateInput = entry.querySelector('input[type="date"]').value;
        const ageDisplay = entry.querySelector('.age-for-entry');

        ageDisplay.className = 'age-for-entry';

        // Check if this entry is hidden
        const entryData = birthdates.find(entry => 
            entry.nickname === nicknameInput && entry.birthdate === birthdateInput
        );
        
        if (entryData && entryData.hidden) {
            ageDisplay.textContent = 'Age: Hidden';
            return;
        }

        if (!birthdateInput) {
            ageDisplay.textContent = 'Age: --';
            return;
        }

        const birthDate = new Date(birthdateInput + 'T00:00:00');
        if (birthDate > referenceDate) {
            ageDisplay.textContent = 'Age: Invalid (future birthdate)';
            return;
        }

        let years = referenceDate.getFullYear() - birthDate.getFullYear();
        let months = referenceDate.getMonth() - birthDate.getMonth();
        let days = referenceDate.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const tempDate = new Date(referenceDate);
            tempDate.setMonth(tempDate.getMonth(), 0);
            days += tempDate.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const ageString = `Age: ${years} years, ${months} months, ${days} days`;

        let colorClass;
        if (years < 2) {
            colorClass = 'col-0to2';
            ageDisplay.classList.add('col-0to2');
        } else if (years < 3) {
            colorClass = 'col-2to3';
            ageDisplay.classList.add('col-2to3');
        } else {
            colorClass = 'col-3plus';
            ageDisplay.classList.add('col-3plus');
        }

        ageDisplay.textContent = ageString;
        const displayNickname = nicknameInput.match(/^[A-Za-z]+$/) ? nicknameInput : 'No Name';

        // Only add to age columns if not hidden
        if (!entryData || !entryData.hidden) {
            if (years < 2) {
                age0to2 += `<li>${displayNickname}: ${years}y ${months}m ${days}d</li>`;
            } else if (years < 3) {
                age2to3 += `<li>${displayNickname}: ${years}y ${months}m ${days}d</li>`;
            } else {
                age3plus += `<li><span class="${colorClass}">${displayNickname}: ${years}y ${months}m ${days}d</span></li>`;
            }
        }
    });

    age0to2 += '</ul>';
    age2to3 += '</ul>';
    age3plus += '</ul>';

    updateGlobalDisplay([age0to2, age2to3, age3plus], true);
}

// Helper to update the global display
function updateGlobalDisplay(texts, isHtml) {
    const columns = [document.querySelector('#age0to2 ul'), document.querySelector('#age2to3 ul'), document.querySelector('#age3plus ul')];
    if (isHtml) {
        columns.forEach((ul, index) => {
            ul.innerHTML = texts[index] || '<ul></ul>';
        });
    } else {
        columns.forEach(ul => {
            ul.innerHTML = '<ul><li>No ages</li></ul>';
        });
    }
}

// Make remaining functions available globally for HTML onclick handlers
window.removeEntry = removeEntry;
window.clearAllData = clearAllData;
window.stepDate = stepDate;
window.resetToToday = resetToToday;
window.toggleHideEntry = toggleHideEntry;
window.jumpToNextBirthday = jumpToNextBirthday;
