const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/login", (req, res, next) => {
  res.send(
    `<script>
      function saveTo(e) {
        localStorage.setItem('auth', document.querySelector('input[type="text"]').value);
      }
    </script>
    <form action='/chathandle' method='POST'>
      <input type='text' />
      <button type='submit' onclick='saveTo(event)'>Login</button>
    </form>`
  );
});
app.post("/chathandle", (req, res, next) => {
  res.redirect("/chat");
});
app.get("/chat", (req, res, next) => {
  const data = fs.readFileSync("Hello.text", "utf8", (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("success add");
    }
  });
  res.send(
    `
    <h4 id="h">${data}</h4>
    <form action='/chat' method='POST'>
      <input type='text' name='message'/>
      <input type='hidden' name='auth' value='' />
      <button type='submit' onclick='saveTo(event)'>send Message</button>
    </form>
    <script>
      function saveTo(event) {
        event.preventDefault();
        var authValue = localStorage.getItem('auth');
        document.querySelector('input[name="auth"]').value = authValue;
        console.log('Message sent:', event.target.previousElementSibling.value);
        event.target.parentElement.submit();
      }
    </script>`
  );
});
app.post("/chat", (req, res, next) => {
  const data = req.body;
  console.log(data.auth, data.message);
  fs.appendFile("Hello.text", `${data.auth}:${data.message};`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("success add");
    }
  });
  res.redirect("/chat");
});

app.listen(3000);
