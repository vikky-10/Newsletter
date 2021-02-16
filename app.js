const express = require("express");
const request = require("request");

const path = require("path");
const { response } = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
// for geyting data use middleware
app.use(express.urlencoded({ extended: true }));

// STATIC FOLDER

app.use(express.static(path.join(__dirname, "public")));

app.post("/signup", (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect("/fail.html");
    return;
  }

  // construct request data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const postData = JSON.stringify(data);

  const options = {
    url: "https://us1.api.mailchimp.com/3.0/lists/<list_id>",
    method: "POST",
    headers: {
      Authorization: "auth  <your_Api_key>",
    },
    body: postData,
  };
  request(options, (err, response, body) => {
    if (err) {
      res.redirect("/fail.html");
    } else {
      if (response.statusCode === 200) {
        res.redirect("success.html");
      } else {
        res.redirect("fail.html");
      }
    }
  });
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(PORT, () =>
  console.log(`Example app listening on port port! ${PORT}`)
);
