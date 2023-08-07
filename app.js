// Function to fetch an access token from Spotify using your client ID and client secret
async function getAccessToken() {
  const clientId = '2b05314f3a7543da945cb169ec57943d'; // Your Spotify Client ID
  const clientSecret = 'dab8f30e115041b5a3a82ca23500e45d'; // Your Spotify Client Secret

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

// Function to search for songs using the obtained access token
async function searchForSongs(accessToken, searchQuery) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });

  const data = await response.json();
  return data;
}

// Function to display search results
function displaySearchResults(results) {
  const searchResultsDiv = document.getElementById('search-results');
  searchResultsDiv.innerHTML = ''; // Clear previous results

  const tracks = results.tracks.items;

  if (tracks.length === 0) {
    searchResultsDiv.innerHTML = '<p>No results found.</p>';
    return;
  }

  const trackList = document.createElement('ul');

  tracks.forEach(track => {
    const trackItem = document.createElement('li');
    trackItem.innerHTML = `<strong>${track.name}</strong> by ${track.artists[0].name}`;

    trackList.appendChild(trackItem);
  });

  searchResultsDiv.appendChild(trackList);
}

// Function to handle search form submission
function handleSearchForm(event) {
  event.preventDefault(); // Prevent the default form submission

  const searchQuery = document.getElementById('search-input').value;

  // Call the function to get the access token
  getAccessToken()
    .then(accessToken => {
      // Search for songs using the obtained access token
      searchForSongs(accessToken, searchQuery)
        .then(results => {
          displaySearchResults(results);
        })
        .catch(error => {
          console.error('Error searching for songs:', error);
        });
    })
    .catch(error => {
      console.error('Error getting access token:', error);
    });
}

// Event listener for form submission
document.getElementById('search-form').addEventListener('submit', handleSearchForm);
