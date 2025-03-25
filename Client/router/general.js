import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import users from "../model/user.js";
import all_books from "../model/books.js";
import { authenticated } from "./auth_users.js";

const public_users = express.Router();

public_users.post("/register", async function (req, res) {
  const { username, password, email, number } = req.body;

  if (username && password && email && number) {
    const find_user = await users.findOne({
      where: {
        email: email,
      },
    });

    if (find_user === null) {
      const access_Token = jwt.sign(
        { name: username },
        process.env.JWT_SECRET_KEY
      );

      await users.create({
        full_name: username,
        password: password,
        email: email,
        number: number,
      });

      return res.status(200).json({
        data: req.body,
        token: access_Token,
      });
    }

    return res.status(404).json("there is already an account by this email");
  } else {
    return res.status(404).send("type all the infos !");
  }
});

public_users.get("/", async function (req, res) {
  try {
    const userss = await users.findAll();
    return res.status(200).json(userss);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching books" });
  }
});

// Get book details based on ISBN

public_users.get("/isbn/:isbn", function (req, res) {
  const isbnID = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books[isbnID]) {
      resolve(books[isbnID]);
    } else {
      reject({ message: "There is no book for this code" });
    }
  })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json(error));
});

// Get book details based on author

public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const bookByAuthor = {};
    const response = await axios.get(process.env.URL + "/books");
    const books = response.data;

    for (const [ID, bookObj] of Object.entries(books)) {
      let book_author = bookObj.author.toLowerCase();
      let first_name_book_author = bookObj.author
        .split(" ")
        .at(0)
        .toLowerCase();

      if (book_author === author || first_name_book_author === author) {
        bookByAuthor[ID] = bookObj;
      }
    }

    if (Object.keys(bookByAuthor).length > 0) {
      return res.status(200).json(bookByAuthor);
    }

    return res
      .status(404)
      .json({ message: "there is no book for this author" });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

public_users.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const bookByTitle = {};
    const response = await axios.get(process.env.URL + "/books");
    const books = response.data;

    for (const [ID, bookObj] of Object.entries(books)) {
      if (bookObj.title.toLowerCase() === title.toLowerCase()) {
        bookByTitle[ID] = bookObj;
      }
    }

    if (Object.keys(bookByTitle).length === 0) {
      return res
        .status(404)
        .json({ message: "there are no books by this title" });
    }

    return res.status(200).json(bookByTitle);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

public_users.get("/review/:isbn", function (req, res) {
  const bookID = req.params.isbn;

  if (books[bookID]) {
    return res.status(200).json(books[bookID].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

export const general = public_users;
