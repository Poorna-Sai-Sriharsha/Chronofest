// API Configuration
const apiKey = 'Add_Your_API_Key_Here';

// DOM Elements
const countryInput = document.getElementById('country-input');
const yearInput = document.getElementById('year-input');
const monthInput = document.getElementById('month-input');
const dayInput = document.getElementById('day-input');
const cardContainer = document.getElementById('card-container');

// Initialize application on page load
window.onload = async () => {
  // Set default year to current year
  yearInput.value = new Date().getFullYear();
  // Fetch and populate country list
  const res = await fetch(`https://calendarific.com/api/v2/countries?api_key=${apiKey}`);
  const data = await res.json();
  data.response.countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country['iso-3166'];
    option.textContent = country.country_name;
    countryInput.appendChild(option);
  });
};

// Set today's date in the form
document.getElementById('today-button').onclick = () => {
  const now = new Date();
  yearInput.value = now.getFullYear();
  monthInput.value = now.getMonth() + 1;
  dayInput.value = now.getDate();
};

// Reset form and clear results
document.getElementById('reset-button').onclick = () => {
  countryInput.selectedIndex = 0;
  yearInput.value = '';
  monthInput.value = '';
  dayInput.value = '';
  cardContainer.innerHTML = '';
};

// Handle form submission
document.querySelector('form').onsubmit = async (e) => {
  e.preventDefault();
  // Get form values
  const country = countryInput.value;
  const year = parseInt(yearInput.value);
  const month = monthInput.value;
  const day = dayInput.value;
  // Validate required fields
  if (!country || country === 'Please Choose a Country') { return alert('Please select a country.');}
  if (!year) {return alert('Please enter a valid year.');}
  // Validate February dates
  if (month == 2 && day > 28) { 
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (!isLeap && day > 28) { return alert('Invalid date for February in a non-leap year.');}
    if (isLeap && day > 29) { return alert('February only has 29 days in a leap year.');}
  }
  // Validate 30-day months
  if (['4', '6', '9', '11'].includes(month) && day == 31) {
    return alert('This month has only 30 days.');
  }
  // Fetch holidays from API
  const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}${month ? `&month=${month}` : ''}${day ? `&day=${day}` : ''}`;
  const res = await fetch(url);
  const data = await res.json();
  // Display results
  const holidays = data.response.holidays;
  cardContainer.innerHTML = holidays.length ? '' : '<p>No holidays found.</p>';
  // Create holiday cards
  holidays.forEach(holiday => {
    const card = document.createElement('section');
    card.innerHTML = `
      <h3>${holiday.name}</h3>
      <p><strong>Date:</strong> ${holiday.date.iso}</p>
      <p><strong>Type:</strong> ${holiday.type.join(', ')}</p>
      <p>${holiday.description || 'No description available.'}</p>
    `;
    cardContainer.appendChild(card);
  });
};

// Security Scripts
// Prevent right-click
document.addEventListener('contextmenu', e => e.preventDefault());

// Prevent developer tools shortcuts
document.onkeydown = e => {
  if (
    e.keyCode === 123 || // F12
    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
    (e.ctrlKey && e.key.toLowerCase() === 'u')
  ) {
    e.preventDefault();
    return false;
  }
};

// Prevent dragging
document.addEventListener('dragstart', e => e.preventDefault());

// Monitor for developer tools
let devtoolsOpen = false;
setInterval(() => {
  const widthThreshold = window.outerWidth - window.innerWidth > 100;
  const heightThreshold = window.outerHeight - window.innerHeight > 100;
  
  if (widthThreshold || heightThreshold) {
    if (!devtoolsOpen) {
      alert('Developer Tools are not allowed!');
    }
    devtoolsOpen = true;
  } else {
    devtoolsOpen = false;
  }
}, 1000);