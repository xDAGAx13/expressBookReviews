const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }else{
        return res.status(404).json({message:'Insufficient Data'})
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.json(books, null, 4);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];
  
    for (const key in books) {
      if (books[key].author === author) {
        matchingBooks.push({ id: key, ...books[key] });
      }
    }
  
    if (matchingBooks.length > 0) {
      res.json(matchingBooks); // Return all books by this author
    } else {
      res.status(404).json({ message: "Author not found" });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  for(const key in books){
    if(books[key].title===title){
        matchingBooks.push({id:key, ...books[key]});
    }
  }
  if(matchingBooks.length>0){
    res.json(matchingBooks);
  }else{
    res.status(404).json({ message: "Title not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.json(books[isbn].reviews)
});

module.exports.general = public_users;
