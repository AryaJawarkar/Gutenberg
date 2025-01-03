# Book Search Application Documentation

## Overview
A web application that allows users to search and browse books by category with infinite scrolling functionality.

## Technical Stack
- Vanilla JavaScript
- REST API Integration
- CSS Grid Layout

## Core Features
1. Category-based book browsing
2. Real-time search functionality
3. Infinite scroll pagination
4. Responsive grid layout
5. Loading state management

## API Integration
Base URL: `http://skunkworks.ignitesol.com:8000`

### Endpoints
- GET `/books`
  - Parameters:
    - `topic` (string): Book category
    - `mime_type` (string): Content type filter
    - `search` (string, optional): Search term

### Response Format
json
{
"results": [
{
"title": "string",
"authors": [{"name": "string"}],
"formats": {
"image/jpeg": "string",
"text/html": "string"
}
}
],
"next": "string"
}

## Core Functions

### `fetchBooks(category, searchTerm)`
Fetches books based on category and optional search term.

Parameters:
- `category` (string): Book category
- `searchTerm` (string, optional): Search query

### `displayBooks(books, clearExisting)`
Displays books in the grid layout.

Parameters:
- `books` (array): Array of book objects
- `clearExisting` (boolean): Whether to clear existing books

### `debounce(func, wait)`
Debounces function calls for search optimization.

Parameters:
- `func` (function): Function to debounce
- `wait` (number): Delay in milliseconds

## Event Handlers

### Search Input
- Debounced search with 500ms delay
- Clear button functionality
- Real-time results update

### Scroll Detection
- Triggers when user reaches near bottom
- Loads more books automatically
- Prevents multiple simultaneous loads

## CSS Classes
- `.hidden`: Hides elements
- `.visible`: Shows elements
- `.rectangle`: Book card container
- `.book-info`: Book details container

## Error Handling
- API fetch errors logged to console
- Loading states properly managed
- Network error recovery

## Performance Considerations
1. Debounced search to prevent API overload
2. Infinite scroll with buffer zone
3. Optimized DOM manipulation

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- CSS Grid support required
