// script.js

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchHistoryList = document.getElementById('search-history');
    const clearHistoryButton = document.getElementById('clear-history');

    // Load search history on page load
    loadSearchHistory();

    // Event listener for search button
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            addSearchQuery(query);
            performSearch(query);
            searchInput.value = '';
        }
    });

    // Event listener for Enter key in search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    // Event listener for clear history button
    clearHistoryButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your entire search history?')) {
            localStorage.removeItem('searchHistory');
            loadSearchHistory();
        }
    });

    // Function to perform the search (you can customize this)
    function performSearch(query) {
        // For demonstration, we'll just log the search query.
        // You can integrate an actual search functionality here.
        console.log(`Searching for: ${query}`);
        // Simulate search delay
        showLoading();
        setTimeout(() => {
            hideLoading();
            alert(`You searched for: "${query}"`);
        }, 1000);
    }

    // Function to add a search query to history
    function addSearchQuery(query) {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        const timestamp = new Date().toLocaleString();
        // Create a new search item object
        const newItem = { query, timestamp };

        // Remove duplicate if exists
        history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());

        // Add to the beginning
        history.unshift(newItem);

        // Limit history to last 20 searches
        if (history.length > 20) {
            history.pop();
        }

        localStorage.setItem('searchHistory', JSON.stringify(history));
        loadSearchHistory();
    }

    // Function to load and display search history
    function loadSearchHistory() {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistoryList.innerHTML = '';

        if (history.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No search history.';
            li.style.textAlign = 'center';
            li.style.color = '#888888';
            searchHistoryList.appendChild(li);
            return;
        }

        history.forEach((item, index) => {
            const li = document.createElement('li');

            // Query Container
            const queryDiv = document.createElement('div');
            queryDiv.classList.add('history-query');
            queryDiv.textContent = item.query;
            queryDiv.title = 'Click to search again';
            queryDiv.addEventListener('click', () => {
                performSearch(item.query);
            });

            // Timestamp
            const timestampSpan = document.createElement('span');
            timestampSpan.classList.add('timestamp');
            timestampSpan.textContent = item.timestamp;

            // Delete Icon
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
            deleteIcon.title = 'Delete this entry';
            deleteIcon.addEventListener('click', () => {
                deleteHistoryItem(index);
            });

            // Left Container (Query and Timestamp)
            const leftContainer = document.createElement('div');
            leftContainer.style.display = 'flex';
            leftContainer.style.flexDirection = 'column';
            leftContainer.style.flex = '1';
            leftContainer.appendChild(queryDiv);
            leftContainer.appendChild(timestampSpan);

            // Right Container (Delete Icon)
            const rightContainer = document.createElement('div');
            rightContainer.appendChild(deleteIcon);

            li.appendChild(leftContainer);
            li.appendChild(rightContainer);
            searchHistoryList.appendChild(li);
        });
    }

    // Function to delete a specific history item
    function deleteHistoryItem(index) {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (index >= 0 && index < history.length) {
            history.splice(index, 1);
            localStorage.setItem('searchHistory', JSON.stringify(history));
            loadSearchHistory();
        }
    }

    // Optional: Function to show loading indicator
    function showLoading() {
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        searchButton.disabled = true;
    }

    // Optional: Function to hide loading indicator
    function hideLoading() {
        searchButton.innerHTML = '<i class="fas fa-arrow-right"></i> Search';
        searchButton.disabled = false;
    }
});
