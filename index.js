const BASE_URL = 'http://skunkworks.ignitesol.com:8000';
let currentPage = null;
let selectedCategory = '';
let isLoading = false;
let tempcurrentPage = null;

// DOM Elements
const homePage = document.getElementById('home-page');
const booksPage = document.getElementById('books-page');
const booksGrid = document.getElementById('books-grid');
const searchInput = document.getElementById('search-input');
const categoryTitle = document.getElementById('category-title');
const loadingElement = document.getElementById('loading');
const backBtn = document.getElementById('back-btn');
const clearSearchBtn = document.getElementById('clear-search');

// Event Listeners
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedCategory = btn.dataset.category;
        showBooksPage(selectedCategory);
    });
});

backBtn.addEventListener('click', showHomePage);

searchInput.addEventListener('input', debounce(handleSearch, 500));

window.addEventListener('scroll', () => {
    if (isNearBottom() && !isLoading && currentPage) {
        loadMoreBooks();
    }
});

// Add clear search functionality
searchInput.addEventListener('input', () => {
    clearSearchBtn.classList.toggle('visible',searchInput.value.length > 0);
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.remove('visible');
    fetchBooks(selectedCategory);
});

// Functions
function showBooksPage(category) {
    homePage.classList.add('hidden');
    booksPage.classList.remove('hidden');
    categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    searchInput.value = '';
    fetchBooks(category);
}

function showHomePage() {
    booksPage.classList.add('hidden');
    homePage.classList.remove('hidden');
    booksGrid.innerHTML = '';
    currentPage = null;
}

async function fetchBooks(category, searchTerm = '') {
    try {
        isLoading = true;
        loadingElement.classList.remove('hidden');

        let url = `${BASE_URL}/books?topic=${category}&mime_type=image`;
        if (searchTerm) {
            url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        tempcurrentPage = data.next;
        if(tempcurrentPage && tempcurrentPage.includes("localhost")){
            currentPage = tempcurrentPage.replace("localhost","skunkworks.ignitesol.com");
        }
        else{
            currentPage = tempcurrentPage;
        }
        console.log(currentPage);
        displayBooks(data.results, searchTerm);
        
    } catch (error) {
        console.error('Error fetching books:', error);
    } finally {
        isLoading = false;
        loadingElement.classList.add('hidden');
    }
}

function displayBooks(books, clearExisting = true) {
    if (clearExisting) {
        booksGrid.innerHTML = '';
    }

    books.forEach(book => {
        const bookElement = createBookElement(book);
        booksGrid.appendChild(bookElement);
    });
}

function createBookElement(book) {
    const div = document.createElement('div');
    div.className = 'rectangle';
    div.innerHTML = `
        <img src="${book.formats['image/jpeg']}" alt="${book.title}">
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.authors[0]?.name || 'Unknown Author'}</p>
        </div>
    `;

    div.addEventListener('click', () => openBook(book));
    return div;
}

function openBook(book) {
    const formats = book.formats;
    const preferredFormats = ['text/html', 'application/pdf', 'text/plain'];
    
    for (const format of preferredFormats) {
        const url = Object.entries(formats).find(([key]) => key.startsWith(format))?.[1];
        if (url && !url.endsWith('.zip')) {
            window.open(url, '_blank');
            return;
        }
    }
    
    alert('No viewable version available');
}

async function loadMoreBooks() {
    if (!currentPage) return;

    try {
        isLoading = true;
        loadingElement.classList.remove('hidden');

        const response = await fetch(currentPage);
        const data = await response.json();
        
        tempcurrentPage = data.next;
        if(tempcurrentPage &&tempcurrentPage.includes("localhost")){
            currentPage = tempcurrentPage.replace("localhost","skunkworks.ignitesol.com");
        }
        else{
            currentPage = tempcurrentPage;
        }
        console.log(currentPage);
        displayBooks(data.results, false);
    } catch (error) {
        console.error('Error loading more books:', error);
     } finally {
        isLoading = false;
        loadingElement.classList.add('hidden');
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.trim();
    console.log(searchTerm);
    fetchBooks(selectedCategory, searchTerm);
}

function isNearBottom() {
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            clearTimeout(timeout);
            func(...args);
        }, wait);
    };
} 