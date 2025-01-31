const STORAGE_KEY = 'BOOKSHELF_APPS';

const generateId = () => Number(new Date());

const saveBooks = (books) => {
  if (books.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } else {
    localStorage.removeItem(STORAGE_KEY); 
  }
};

const loadBooks = () => {
  const booksJson = localStorage.getItem(STORAGE_KEY);
  return booksJson ? JSON.parse(booksJson) : [];
};

const findBookIndex = (books, id) => books.findIndex((book) => book.id === id);

const bookForm = document.getElementById('bookForm');
const searchForm = document.getElementById('searchBook');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');

const createBook = (id, title, author, year, isComplete) => ({
  id,
  title,
  author,
  year: Number(year),
  isComplete,
});

const createBookElement = (book) => {
  const bookItem = document.createElement('div');
  bookItem.setAttribute('data-bookid', book.id);
  bookItem.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'bookItemTitle');
  title.textContent = book.title;

  const author = document.createElement('p');
  author.setAttribute('data-testid', 'bookItemAuthor');
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement('p');
  year.setAttribute('data-testid', 'bookItemYear');
  year.textContent = `Tahun: ${book.year}`;

  const buttonContainer = document.createElement('div');
  
  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  
  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.textContent = 'Hapus Buku';
  
  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.textContent = 'Edit Buku';

  buttonContainer.append(toggleButton, deleteButton, editButton);
  bookItem.append(title, author, year, buttonContainer);

  toggleButton.addEventListener('click', () => toggleBookStatus(book.id));
  deleteButton.addEventListener('click', () => deleteBook(book.id));
  editButton.addEventListener('click', () => editBook(book.id));

  return bookItem;
};

const renderBooks = (books = loadBooks()) => {
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  });
};

const addBook = (event) => {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const books = loadBooks();
  const newBook = createBook(generateId(), title, author, year, isComplete);
  books.push(newBook);
  
  saveBooks(books);
  renderBooks(books);
  event.target.reset();
};

const toggleBookStatus = (bookId) => {
  const books = loadBooks();
  const bookIndex = findBookIndex(books, bookId);
  
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooks(books);
    renderBooks(books);
  }
};

const deleteBook = (bookId) => {
  const confirmation = confirm('Apakah Anda yakin ingin menghapus buku ini?');
  
  if (confirmation) {
    const books = loadBooks();
    const bookIndex = findBookIndex(books, bookId);
    
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      saveBooks(books); 
      renderBooks(books);
    }
  }
};

const deleteAllBooks = () => {
  const confirmation = confirm('Apakah Anda yakin ingin menghapus semua buku?');
  
  if (confirmation) {
    localStorage.removeItem(STORAGE_KEY);
    renderBooks([]);
  }
};

const editBook = (bookId) => {
  const books = loadBooks();
  const book = books.find((b) => b.id === bookId);
  
  if (book) {
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;

    const bookIndex = findBookIndex(books, bookId);
    books.splice(bookIndex, 1);
    saveBooks(books);
    
    document.getElementById('bookFormTitle').focus();
  }
};

const searchBooks = (event) => {
  event.preventDefault();
  
  const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
  const books = loadBooks();
  
  const filteredBooks = searchTerm
    ? books.filter((book) => book.title.toLowerCase().includes(searchTerm))
    : books;
  
  renderBooks(filteredBooks);
};

bookForm.addEventListener('submit', addBook);
searchForm.addEventListener('submit', searchBooks);

document.addEventListener('DOMContentLoaded', () => {
  renderBooks();
});