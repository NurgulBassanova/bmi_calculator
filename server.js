const express = require('express'); // Express framework for creating the server
const bodyParser = require('body-parser'); // Middleware for parsing form data
const path = require('path'); // Work with file paths

// Initialize the app
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(express.json()) // Middleware for parsing JSON data

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
    // Serve the index.html file when the user accesses the root URL
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route for handling the form submission
app.post('/calculate', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);
    const errors = [];

    // Validate input
    if (!weight){
        errors.push("You did not entered weight value!") // Existense check
    }
    else if(weight <= 0){
        errors.push("Weight must be non-negative value!") // Sign check
    }
    if(!height){
        errors.push("You did not entered height value!") // Existense check
    }
    else if(height <= 0){
        errors.push("Height must be non-negative value!") // Sign check
    }
    // Output all errors
    if(errors.length > 0){
        return res.send(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BMI Result</title>
                <link rel="stylesheet" href="/style.css"> 
            </head>
            <body>
                <ul>
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
                <a href="/">Go back</a>
            </body>
            </html>`);
    }

    // Round BMI 
    function roundToOneDecimal(number){
        return parseFloat(number.toFixed(1));
    }
    // Calculate BMI
    const bmi = roundToOneDecimal(weight / (height * height));

    // Define category
    let category = '';
    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.5) {
        category = "Normal weight";
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
    } else if (bmi >= 30) {
        category = "Obesity";
    }

    // Return the result
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BMI Result</title>
            <link rel="stylesheet" href="/style.css"> 
        </head>
        <body>
            <h1>BMI = ${bmi}</h1>
            <p>Your category: ${category}</p>
            <a href="/">Go back</a>
        </body>
        </html>
    `);
});

// Start the server
const PORT = 3000; // Define the port number
app.listen(PORT, () => {
    // Log a message when the server starts
    console.log(`Server is running on http://localhost:${PORT}`);
});


