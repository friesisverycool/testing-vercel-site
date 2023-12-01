mixpanel.init("ab47e787320c8c38f1ffb2d868e4fffa");

let data = [];

function fetchDataFromServer() {
  return fetch('/api/serviceHours')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }
      return response.json();
    })
    .then(dataFromServer => {
      // Update local data with data from the server
      data = dataFromServer;
    })
    .catch(error => {
      console.error('Error fetching data from the server:', error);
    });
}

function saveDataToServer() {
  return fetch('/api/serviceHours', {
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
      console.log('Data saved to the server successfully');
      return response.json(); // Parse response as JSON
    })
    .then(updatedData => {
      // Update local data with data from the server
      data = updatedData;
      updateSubmittedHours();
    })
    .catch(error => {
      console.error('Error saving data to the server:', error);
    });
}

// Initial fetch of data from the server
fetchDataFromServer()
  .then(() => {
    // Load data from localStorage after fetching from the server
    data = JSON.parse(localStorage.getItem('serviceHoursData')) || [];
    updateSubmittedHours();
  });

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
  saveDataToLocalStorage();
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

// Save data to localStorage when the page is about to be unloaded
window.addEventListener('beforeunload', function () {
  saveDataToLocalStorage();
});

// Save data to the server when the page is about to be unloaded
window.addEventListener('beforeunload', function () {
  saveDataToServer();
});

// Initial update of submitted hours
updateSubmittedHours();
