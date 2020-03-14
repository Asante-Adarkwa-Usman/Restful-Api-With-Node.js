const express = require("express")
const mongoose = require("mongoose")
const body_parser = require("body-parser")
const path = require("path")
const validator = require("validator")
const bcrypt = require("bcrypt")
mongoose.promise = global.promise

let app = express()

app.use(body_parser.json())
app.use(body_parser.urlencoded({
  extended: false
}))

let port = 9000 // creating the port
app.listen(port, () => {
  console.log(`listening to port ${port}`)
})

// creating a mongodb connection
const url = "mongodb://localhost:27017/user"

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

//creating a mongodb schema
let user = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: {
    type: String,
    requred: true,

  },
  lastName: {
    type: String,
    requred: true
  },
  age: {
    type: Number,
    requred: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
})
// adding schema as a mongoose model
let users = mongoose.model("user", user)

// new users({
//   _id: new mongoose.Types.ObjectId,
//   firstName: "Asante",
//   lastName: "Emmanuel",
//   age: 90,
//   password: "emma2001",
//   email: "emmaasante854@gmail.com"
// })
// .save()
// .then(data => console.log(data))

//user signin and authentication
app.post("/signin", (req, res, next) => {
  users.findOne({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, hashed) => {
          if (hashed) {
            return res.json({
              res: "Authentication successful"
            })
          } else {
            return res.json({
              res: "Authentication failed"
            })
          }
        })
      } else {
        return res.json({
          res: "wrong email or password"
        })
      }
    })
    .catch(error => {
      console.log(error)
    })
})

// user signup
app.post("/signup", (req, res, next) => {
  users.findOne({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user) {
        return res.json({
          res: "email already exist"
        })
      } else {

        if (validator.isInt(req.body.age) && validator.isEmail(req.body.email)) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              console.log(err)
            }
            let age = req.body.age
            let email = req.body.email
            let new_user = new users({
              _id: new mongoose.Types.ObjectId,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              age: age,
              email: email,
              password: hash
            })

            new_user
              .save()
              .then(data => {
                if (data) {
                  return res.json({
                    res: "user account created successfully",
                    data: data
                  })
                }
              })
              .catch(error => {
                console.log(error)
              })
          })

        } else {
          return res.json({
            res: "invalid data input for email or age"
          })
        }

      }
    })
    .catch(error => {
      console.log(error)
    })
})

//send response to user if user details exists

app.get("/users", (req, res, next) => {

  let data = users.find({})
    .exec()
    .then(data => {
      console.log(data);
      res.json({
        data: data
      })
    }).catch(error => {
      console.log(error);
    })

})

//Checking if user exists on the database

app.post("/find_user", (req, res, next) => {
  //use promise to find a user on the database

  //getting firstName from user and search database based on firstName
  let firstName = req.body.firstName

  users.findOne({
      firstName: firstName
    })
    .exec()
    .then(user => {
      //if user found based on firstName then send response to user
      if (user) return res.json({
        res: "user found",
        data: user
      });
      return res.json({
        res: "user does not exist"
      })
    }).catch(error => {
      console.log(error);
    })
})


let names = [{
  name: "kofi"
}, {
  name: "ama"
}, {
  name: "kwame"
}]

let firstPage = (request, response, next) => {

  let name = request.body.name
  names.forEach(function(x) {
    if (name === x.name) {
      console.log(name);

      next()
    }
    response.json({
      response: "name not found"
    })

  })

}
let next_page = (req, res) => {

  res.json({
    res: "this is the next page"
  })
}

app.get("/home", (request, response, next) => {
  response.json({
    response: 'This is our first lecture'
  })
})

app.get("/", () => {
  res.send
})









// let user = {
//     first_name: "mikel",
//     last_name: "dunamis",
//     color: "blue"
// }
//
// app.get("/", (req,res,next) => {
//     res.sendFile(path.join(__dirname + "/index.html"))
// })
//
// app.get("/home", (req,res,next) => {
//     let first_name = req.body.first_name
//     let last_name = req.body.last_name
//     let color = req.body.color
//
//     if(first_name == user.first_name && last_name == user.last_name && color == user.color){
//         res.json({data: "data found", user: user})
//     }
//     res.json({res: "not found"})
// })
//
// let port = 3000 || process.env.PORT
//
// app.listen(port, () => {
//     console.log(`listening to port ${port}`)
// })


module.exports = app
