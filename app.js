document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('book-form');
    const updateForm = document.getElementById('update-form');
    const bookList = document.getElementById('book-list');

    // Function to fetch books from the server and update the book list
    const fetchBooks = async () => {
        try {
            const res = await fetch('https://lms-backend-nmvs.onrender.com/books');
            const books = await res.json();
            bookList.innerHTML = '';
            books.forEach(book => {
                const li = document.createElement('li');

                const bookInfo = document.createElement('div');
                bookInfo.className = 'info';
                bookInfo.textContent = `${book.name} by ${book.author} (ISBN: ${book.isbn})`;
                li.appendChild(bookInfo);

                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'actions';

                const updateBtn = document.createElement('button');
                updateBtn.textContent = 'Update';
                updateBtn.className = 'update';
                updateBtn.addEventListener('click', () => showUpdateForm(book));
                actionsDiv.appendChild(updateBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'delete';
                deleteBtn.addEventListener('click', () => deleteBook(book._id));
                actionsDiv.appendChild(deleteBtn);

                li.appendChild(actionsDiv);
                bookList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    // Function to add a new book
    const addBook = async (book) => {
        try {
            const res = await fetch('https://lms-backend-nmvs.onrender.com/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            });
            if (!res.ok) {
                throw new Error('Failed to add book');
            }
            fetchBooks();
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    // Function to delete a book
    const deleteBook = async (id) => {
        try {
            const res = await fetch(`https://lms-backend-nmvs.onrender.com/books/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                throw new Error('Failed to delete book');
            }
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    // Function to show the update form with pre-filled data
    const showUpdateForm = (book) => {
        document.getElementById('update-name').value = book.name;
        document.getElementById('update-author').value = book.author;
        document.getElementById('update-isbn').value = book.isbn;
        document.getElementById('update-id').value = book._id; // Store the book ID for updating
    };

    // Function to update a book
    const updateBook = async () => {
        const id = document.getElementById('update-id').value;
        const name = document.getElementById('update-name').value;
        const author = document.getElementById('update-author').value;
        const isbn = document.getElementById('update-isbn').value;
        try {
            const res = await fetch(`https://lms-backend-nmvs.onrender.com/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, author, isbn }),
            });
            if (!res.ok) {
                throw new Error('Failed to update book');
            }
            fetchBooks();
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    // Event listener for submitting the add book form
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const book = {
            name: document.getElementById('name').value,
            author: document.getElementById('author').value,
            isbn: document.getElementById('isbn').value,
        };
        addBook(book);
        form.reset();
    });

    // Event listener for submitting the update book form
    updateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateBook();
        updateForm.reset();
    });

    // Fetch books when the page loads
    fetchBooks();
});
