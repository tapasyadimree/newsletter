const express = require('express')
const bodyParser = require('body-parser')
const mailchimp = require('@mailchimp/mailchimp_marketing')
require('dotenv').config()
const PORT = process.env.PORT || 3000

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mailchimp.setConfig({
  apiKey: process.env.KEY,
  server: "us21"
});

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html")
})

app.post("/", function(req, res){
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    console.log(firstName, lastName, email);

    const listId = "16c6af65f8";
  const subscribingUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
  };

  async function run() {
      try {
          const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
            }
          });
 
          console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id}.`
          );
 
          res.sendFile(__dirname + "/success.html");
      } catch (e) {
          res.sendFile(__dirname + "/failure.html");
      }
  }

   run();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(PORT,function(){
    console.log("Server is running on port"+ PORT);
})
