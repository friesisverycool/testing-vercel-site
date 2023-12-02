
// Load data from localStorage
let data = JSON.parse(localStorage.getItem('serviceHoursData')) || [];

// Check if you want to clear all data (including logs and total hours)
let clearAllData = false;

if (clearAllData) {
    // Clear all data by setting an empty array
    data = [];
}
document.getElementById('serviceHourForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let name = document.getElementById('name').value;
    let date = document.getElementById('date').value;
    let hours = parseInt(document.getElementById('hours').value);
    let description = document.getElementById('description').value;

    // Check if the person already exists in the data array
    let person = data.find(item => item.name === name);

    if (person) {
        // If the person exists, add the new hours to their total hours
        person.hours += hours;
        person.logs.push({ date, hours, description }); // Add the log entry
    } else {
        // If the person does not exist, add them to the data array with the given hours
        data.push({ name, hours, logs: [{ date, hours, description }] });
    }

    // Clear the form inputs
    document.getElementById('name').value = '';
    document.getElementById('date').value = '';
    document.getElementById('hours').value = '';
    document.getElementById('description').value = '';

    // Update the submitted hours list
    updateSubmittedHours();
    // Save data to localStorage
    saveDataToLocalStorage();
});

function updateSubmittedHours() {
    let submittedHoursList = document.getElementById('submittedHours');

    // Clear the current list items
    while (submittedHoursList.firstChild) {
        submittedHoursList.removeChild(submittedHoursList.firstChild);
    }

    // Add new list items for each person's total hours and logs
    data.forEach(person => {
        let listItem = document.createElement('li');
        let toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Logs';
        toggleButton.className = 'toggleButton'; // Added class name
        toggleButton.addEventListener('click', function () {
            // Toggle the display of logs
            let logsList = listItem.querySelector('.logs');
            logsList.style.display = (logsList.style.display === 'none' || logsList.style.display === '') ? 'block' : 'none';
        });

        listItem.textContent = `${person.name}: ${person.hours} hours `;
        listItem.appendChild(toggleButton);

        // Create a list for logs
        let logsList = document.createElement('ul');
        logsList.className = 'logs';

        // Add new list items for each log entry
        person.logs.forEach(log => {
            let logItem = document.createElement('li');
            logItem.textContent = `Date: ${log.date}, Hours: ${log.hours}, Description: ${log.description}`;
            logsList.appendChild(logItem);
        });

        // Append logs list to the main list item
        listItem.appendChild(logsList);

        // Append the main list item to the submitted hours list
        submittedHoursList.appendChild(listItem);
    });
}

// Save data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('serviceHoursData', JSON.stringify(data));
}

// Initial update of submitted hours
updateSubmittedHours();
