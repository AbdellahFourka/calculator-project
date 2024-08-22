// Variables for memory and theme
let memory = 0;
let currentTheme = 'dark';

// DOM Elements
const displayElement = document.getElementById('display');
const historyLogElement = document.getElementById('history-list'); // Updated ID to match HTML
const themeSwitch = document.getElementById('theme-toggle'); // Updated ID to match HTML
const graphContainer = document.getElementById('graph-container');
const graphElement = document.getElementById('graph');

// Function to append characters to the display
function appendToDisplay(character) {
    if (displayElement.innerText === '0') {
        displayElement.innerText = character;
    } else {
        displayElement.innerText += character;
    }
}

// Function to calculate and display the result
function calculate() {
    try {
        let expression = displayElement.innerText.replace('^', '**').replace('!', 'factorial');
        let result = math.evaluate(expression);
        updateHistory(displayElement.innerText + ' = ' + result);
        displayElement.innerText = result;
    } catch (error) {
        displayElement.innerText = 'Error';
    }
}

// Factorial function
function factorial(n) {
    if (n < 0) return NaN;
    return n ? n * factorial(n - 1) : 1;
}

// Function to handle backspace
function backspace() {
    displayElement.innerText = displayElement.innerText.slice(0, -1) || '0';
}

// Function to clear the display
function clearDisplay() {
    displayElement.innerText = '0';
}

// Function to update the history log
function updateHistory(entry) {
    let listItem = document.createElement('li');
    listItem.innerText = entry;
    historyLogElement.appendChild(listItem);
}

// Function to store the current value in memory
function storeMemory() {
    memory = parseFloat(displayElement.innerText);
}

// Function to recall the stored memory value
function recallMemory() {
    appendToDisplay(memory);
}

// Function to clear the memory
function clearMemory() {
    memory = 0;
}

// Function to switch themes
themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    saveSettings();
});

// Function to switch between different calculator modes
function switchMode(mode) {
    switch (mode) {
        case 'basic':
        case 'scientific':
        case 'programming':
        case 'unit-conversion':
            hideGraph();
            break;
        case 'graphing':
            showGraph();
            break;
        default:
            break;
    }
}

// Function to display the graphing container
function showGraph() {
    graphContainer.classList.remove('hidden');
    const ctx = graphElement.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 101}, (_, i) => i - 50),
            datasets: [{
                label: 'f(x)',
                data: Array.from({length: 101}, (_, i) => {
                    try {
                        return math.evaluate(displayElement.innerText.replace('x', (i - 50)));
                    } catch {
                        return null;
                    }
                }),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to hide the graphing container
function hideGraph() {
    graphContainer.classList.add('hidden');
}

// Function to save settings to local storage
function saveSettings() {
    localStorage.setItem('calculatorTheme', currentTheme);
}

// Function to load settings from local storage
function loadSettings() {
    const savedTheme = localStorage.getItem('calculatorTheme');
    if (savedTheme) {
        currentTheme = savedTheme;
        if (currentTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }
}

// Function to handle voice input
function voiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support voice recognition. Please use a modern browser.');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        let spokenText = event.results[0][0].transcript;
        appendToDisplay(spokenText);
    };

    recognition.onerror = function(event) {
        alert('Error occurred in recognition: ' + event.error);
    };
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', loadSettings);

// Keyboard support for enhanced input handling
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 's') {
        switchMode('scientific');
    } else if (key === 'b') {
        switchMode('basic');
    } else if (key === 'p') {
        switchMode('programming');
    } else if (key === 'g') {
        switchMode('graphing');
    } else if (key === 'c') {
        switchMode('unit-conversion');
    }
});
