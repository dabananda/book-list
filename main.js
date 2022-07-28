const form = document.querySelector('#form');
const bookList = document.querySelector('#book-list');

// Book class
class Book {
  constructor(title, author, isbn) {
    (this.title = title), (this.author = author), (this.isbn = isbn);
  }
}

// UI class
class UI {
  static addToBookList(book) {
    const bookList = document.querySelector('#book-list');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td scope="row">${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>
        <a class="btn btn-danger" href="#">X</a>
      </td>
    `;
    bookList.appendChild(tr);
  }

  // Book details input field clearing function
  static clearInputs() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

  // Book Remove function
  static removeBook(book) {
    if (book.hasAttribute('href')) {
      // Removing book from the book list
      book.parentElement.parentElement.remove();
      // passing alert to showAlert() function
      UI.showAlert('The book is deleted from the list!', 'alert-danger');

      // passing book isbn number to remove form localStoreage
      Store.removeBookFromLocalStorage(
        book.parentElement.previousElementSibling.textContent.trim()
      );
    }
  }

  // Alert function
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    // Adding alert
    let contianer = document.querySelector('.container');
    let form = document.querySelector('#form');
    contianer.insertBefore(div, form);

    // Vanishing alert 3 seconds later
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }
}

// Book Store of Local Storage
class Store {
  // getting localStorage books
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  // adding new books
  static addBook(book) {
    let books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  // for showing the book list form localStorage
  static displayBooks() {
    let books = Store.getBooks();
    books.map(book => {
      UI.addToBookList(book);
    });
  }

  // removing books form the localStorage
  static removeBookFromLocalStorage(isbn) {
    let books = Store.getBooks();
    books.map((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

function newBook(e) {
  // preventing reload while submitting the form
  e.preventDefault();

  // Get the book title, author and isbn
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // validating book details
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill all the input fields!', 'alert-warning');
  } else {
    // creating book details
    const book = new Book(title, author, isbn);
    // calling and passing book details
    UI.addToBookList(book);

    // Calling alert for success
    UI.showAlert('Book added successfully 😁', 'alert-success');
    // calling function of clearing book details input fields
    UI.clearInputs();

    // passing "book" to addBook() function to save the book details in localStorage
    Store.addBook(book);
  }
}

// Delete book function. This function will call the removeBook() function which actually deletes the book form the book list
function deleteBook(e) {
  UI.removeBook(e.target);
}

// Event listeners
form.addEventListener('submit', newBook);
bookList.addEventListener('click', deleteBook);
document.addEventListener('DOMContentLoaded', Store.displayBooks);
