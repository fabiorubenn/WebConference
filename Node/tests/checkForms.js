// index.js
// express: A lightweight web application framework for Node.js. We will be using this to handle routing in our backend server.
// body-parser: A middleware which will help us parse incoming request inputs (user inputs) to the req.body object.
// express-validator: The library which we will be using to handle incoming input validation.

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 2022;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile('formToServer.html', { root: __dirname });
});
   
app.listen(port);
console.log('Server running at: http://localhost:'+port);

// add simple validation and sanitisation rules to incoming requests. 
// Firstly, we want to check if the value input into the email field is a valid email or not. 
// Then, we'll want to enforce that the password contains at least 6 characters.

// In the snippet above, we are making use of two validator methods:
// isEmail(): This validator function checks if the incoming string is a valid email address.
// isLength(): This validator checks if the length of a string falls in a specified range, 
// in our case, the range specified is a minimum of 6 characters.

// To ensure email addresses supplied by the user is free of noise and irregularities we will 
// add a sanitiser to our email field as seen in the snippet above. The normalizeEmail() method 
// helps to convert the emails entered into the standard approved format. This means if a user 
// enters, for example, username@googlemail.com, it will be canonicalised to username@gmail.com.

const { body, validationResult } = require('express-validator');

// ####### Method to do the login: #######

app.post('/login',
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({
        min: 6
    }),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
        })
    });


// ####### Methods to do the registration: #######


// Create our user registration endpoint with no verifications
app.post('/registerMethod1', (req, res) => {
    // Validate incoming input
    res.status(200).json({
        success: true,
        message: 'Registration successful',
    });
});

// To make sure our users input unique usernames during registration, We'll have to write a custom 
// validator for this, which can be done using the custom() method. The custom() method accepts a 
// function, which can additionally be async. If the function is async, you'll want to reject the 
// promise if the validation fails, and specify a custom message. If not, you can throw an exception.
// We are calling the find() method on the User model Mongoose schema to check if the username entered 
// by the client already exists in our database. If it's present, we reject the promise with a message 
// we'd like to return back to the user.
app.post('/registerMethod2',
    body("username").custom(value => {
        return User.find({
            username: value
        }).then(user => {
            if (user.length > 0) {
                // Custom error message and reject
                // the promise
                return Promise.reject('Username already in use');
            }
        });
    }),
    (req, res) => {
        // Validate incoming input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        else {
            res.status(200).json({
            success: true,
            message: 'Registration successful',
    });
        }
    })

// Throw an exception as a way to signify invalid input
app.post('/registerMethod3',
        body("username").custom(value => {
            return User.find({
                username: value
            }).then(user => {
                if (user.length > 0) {
                    throw ("Username is taken!"); //custom error message
                }
            });
        }))


// Schema validation offers a cleaner approach to validating data. Instead of 
// calling numerous functions, we specify the validation rules for each field 
// and pass the schema into a single middleware function called checkSchema()
/*
const {body, checkSchema, validationResult} = require('express-validator');
const registrationSchema = {
    username: {
        custom: {
            options: value => {
                return User.find({
                    username: value
                }).then(user => {
                    if (user.length > 0) {
                        return Promise.reject('Username already in use')
                    }
                })
            }
        }
    },
    gender: {
        notEmpty: true,
        errorMessage: "Gender field cannot be empty"
    },
    password: {
        isStrongPassword: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        },
        errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number",
    },
    phone: {
        notEmpty: true,
        errorMessage: "Phone number cannot be empty"
    },
    email: {
        normalizeEmail: true,
        custom: {
            options: value => {
                return User.find({
                    email: value
                }).then(user => {
                    if (user.length > 0) {
                        return Promise.reject('Email address already taken')
                    }
                })
            }
        }
    }
}
// By specifying a schema, we can drill into specific input fields to apply validators and 
// sanitizers, and it's much more readable than chaining a lot of methods with validation 
// messages like we've seen in the previous sections. Now, we can go ahead and use this 
// checkSchema() to validate data on registration
app.post('/signup', checkSchema(registrationSchema), (req, res) => {
    // Validate incoming input
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    res.status(200).json({
        success: true,
        message: 'Registration successful',
    });
})
*/