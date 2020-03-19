const express = require('express');
const port = 3000;
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("static"));

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/singup.html");
});

const list_id = "5532f98497";
const api_key = "64bc5d0d2ca27df3a880ddd9fd4e472a-us19";

app.post("/", (req,res) => {

    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const email = req.body.email;

    console.log(nome + " " + sobrenome + " " + email);

    const data = {
        members: [
            {email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: nome,
                LNAME: sobrenome
            }
        }
        ]
    };

    const jsondata = JSON.stringify(data);

    const url="https://us19.api.mailchimp.com/3.0/lists/" + list_id;

    const options = {
        method: "POST",
        auth: "tawliew:64bc5d0d2ca27df3a880ddd9fd4e472a-us19"
    }

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data));

            if(response.statusCode == 200){
                res.sendFile(__dirname + "/sucess.html");
            }
            else{
                res.sendFile(__dirname + "/failure.html");
            }
            
        });
    });
    request.write(jsondata);
    request.end();
});

app.post("/failure", (req,res) => {
    res.redirect("/");
});
app.post("/sucess", (req,res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => console.log("Server UP on port " + port));