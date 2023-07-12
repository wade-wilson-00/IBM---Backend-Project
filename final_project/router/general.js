const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// const axios = require("axios").default;

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      res.status(200).json({ message: "User successfully registered." });
    } else {
      res.status(404).json({ message: "Username already exists." });
    }
  } else {
    res.status(404).json({ message: "Unable to register." });
  }
});

// Get the book list available in the shop
public_users.get("/books", function (req, res) {
  const getbooks = new Promise((resolve, reject) => {
    resolve(res.send(books));
  });
  getbooks.then(() => console.log("Promise for Task 10 resolved"));
});

// Get book details based on ISBN
public_users.get("/books/isbn/:isbn", function (req, res) {
  const getbooksISBN = new Promise((resolve, reject) => {
    let isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(res.send(books[isbn]));
    } else {
      reject(res.send("The mentioned ISBN does not exist "));
    }
  });

  getbooksISBN
    .then(function () {
      console.log("Promise is resolved");
    })
    .catch(function () {
      console.log("The mentioned ISBN does not exist");
    });
});

// Get book details based on author
public_users.get("/books/author/:author", function (req, res) {
  const getbooksAuthor = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({
          isbn: isbn,
          title: books[isbn]["title"],
          reviews: books[isbn]["reviews"],
        });
        resolve(res.send(JSON.stringify({ booksbyauthor }, null, 4)));
      }
    });
    reject(res.send("The mentioned author does not exist "));
  });

  getbooksAuthor
    .then(function () {
      console.log("Promise is resolved");
    })
    .catch(function () {
      console.log("The mentioned author does not exist");
    });
});

// Get all books based on title

public_users.get("/books/title/:title", function (req, res) {
  const getbooksTitle = new Promise((resolve, reject) => {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["title"] === req.params.title) {
        booksbytitle.push({
          isbn: isbn,
          author: books[isbn]["author"],
          reviews: books[isbn]["reviews"],
        });
        resolve(res.send(JSON.stringify({ booksbytitle }, null, 4)));
      }
    });
    reject(res.send("The mentioned title does not exist "));
  });

  getbooksTitle
    .then(function () {
      console.log("Promise is resolved");
    })
    .catch(function () {
      console.log("The mentioned title does not exist");
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const getbooksReview = new Promise((resolve, reject) => {
    let isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(res.send(books[isbn]["reviews"]));
    } else {
      reject(res.send("The mentioned ISBN does not exist "));
    }
  });

  getbooksReview
    .then(function () {
      console.log("Promise is resolved");
    })
    .catch(function () {
      console.log("The mentioned ISBN does not exist");
    });
});

module.exports.general = public_users;
