// Variables for memory and theme
let memory = 0;
let currentTheme = 'dark';

// DOM Elements
const displayElement = document.getElementById('display');
const themeSwitch = document.getElementById('theme-toggle');

// Function to append characters to the display
function appendToDisplay(character) {
    if (displayElement.innerText === '0' || displayElement.innerText === 'Error') {
        displayElement.innerText = character;
    } else {
        displayElement.innerText += character;
    }
}

// Function to calculate and display the result
function calculate() {
    try {
        let expression = displayElement.innerText
            .replace('^', '**')
            .replace(/÷/g, '/')
            .replace(/×/g, '*');
        let result = math.evaluate(expression);
        displayElement.innerText = result;
    } catch (error) {
        displayElement.innerText = 'Error';
    }
}

// Function to handle backspace
function backspace() {
    displayElement.innerText = displayElement.innerText.slice(0, -1) || '0';
}

// Function to clear the display
function clearDisplay() {
    displayElement.innerText = '0';
}

// Function to switch themes
themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
});

// Attach event listeners to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.getAttribute('data-value');
        if (value !== null) {
            switch (value) {
                case 'clear':
                    clearDisplay();
                    break;
                case 'backspace':
                    backspace();
                    break;
                case 'equals':
                    calculate();
                    break;
                case 'voice':
                    // Optional: Implement voice input if desired
                    break;
                default:
                    appendToDisplay(value);
                    break;
            }
        }
    });
});
