// script.js
// Load data from the server
let data = [];

document.getElementById('serviceHourForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let name = document.getElementById('name').value;
    let date = document.getElementById('date').value;
    let hours = parseInt(document.getElementById('hours').value);
    let description = document.getElementById('description').value;

    let person = data.find(item => item.name === name);

    if (person) {
        person.hours += hours;
        person.logs.push({ date, hours, description });
    } else {
        data.push({ name, hours, logs: [{ date, hours, description }] });
    }

    document.getElementById('name').value = '';
    document.getElementById('date').value = '';
    document.getElementById('hours').value = '';
    document.getElementById('description').value = '';

    updateSubmittedHours();
    saveDataToServer();
});

function updateSubmittedHours() {
    let submittedHoursList = document.getElementById('submittedHours');

    while (submittedHoursList.firstChild) {
        submittedHoursList.removeChild(submittedHoursList.firstChild);
    }

    data.forEach(person => {
        let listItem = document.createElement('li');
        let toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Logs';
        toggleButton.className = 'toggleButton';
        toggleButton.addEventListener('click', function () {
            let logsList = listItem.querySelector('.logs');
            logsList.style.display = (logsList.style.display === 'none' || logsList.style.display === '') ? 'block' : 'none';
        });

        listItem.textContent = `${person.name}: ${person.hours} hours `;
        listItem.appendChild(toggleButton);

        let logsList = document.createElement('ul');
        logsList.className = 'logs';

        person.logs.forEach(log => {
            let logItem = document.createElement('li');
            logItem.textContent = `Date: ${log.date}, Hours: ${log.hours}, Description: ${log.description}`;
            logsList.appendChild(logItem);
        });

        listItem.appendChild(logsList);

        submittedHoursList.appendChild(listItem);
    });
}

function saveDataToServer() {
    fetch('/api/saveServiceHours', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save data on the server');
        }
        console.log('Data saved successfully');
    })
    .catch(error => {
        console.error('Error saving data:', error);
    });
}

// Fetch data from the server on page load
fetch('/api/getServiceHours')
    .then(response => response.json())
    .then(serverData => {
        data = serverData;
        updateSubmittedHours();
    })
    .catch(error => {
        console.error('Error fetching data from the server:', error);
    });
