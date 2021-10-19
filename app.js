var mysql = require("mysql");
//npm install mysql
var inquirer = require("inquirer");
//npm i inquirer

var connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'blood_donation'
    });

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
})

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Find donor by blood type",
                "Find recipent by blood type",
                "Find number of donors",
                "Find recipent age within a specific range",
                "Sort donors in alphabetical order",
                "Sort recipents in alphabetical order",
                "exit"
            ]

        })
        .then(function (answer) {
            switch (answer.action) {
                case "Find donor by blood type":
                    donorbloodtypeSearch();
                    break;

                case "Find recipent by blood type":
                    recipentbloodtypeSearch();
                    break;


                case "Find number of donors":
                    donorSearch();
                    break;

                case "Find recipent age within a specific range":
                    agerangeSearch();
                    break;

                case "Sort donors in alphabetical order":
                    alphabetizedonors();
                    break;

                    case "Sort recipents in alphabetical order":
                    alphabetizerecipents();
                    break;

                case "exit":
                    connection.end();
                    break;

            }
        });
}


function donorbloodtypeSearch() {
    inquirer
        .prompt({
            name: "Blood_type",
            type: "input",
            message: "What blood type would you like to search for?"
        })
        .then(function (answer) {
            var query = "SELECT Donor_id, Donor_name, Donor_age, Donor_type FROM donor_db WHERE ?";
            connection.query(query, { Blood_type: answer.Blood_type }, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log("ID: " + res[i].Donor_id + " || Name: " + res[i].Donor_name + " || Age: " + res[i].Donor_age + " || Type: " + res[i].Donor_type);
                }
                runSearch();
            });
        });
}

function recipentbloodtypeSearch() {
    inquirer
        .prompt({
            name: "Blood_type",
            type: "input",
            message: "What blood type would you like to search for?"
        })
        .then(function (answer) {
            var query = "SELECT Recipent_id, Recipent_name, Recipent_age FROM recipent_db WHERE ?";
            connection.query(query, { Blood_type: answer.Blood_type }, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log("ID: " + res[i].Recipent_id + " || Name: " + res[i].Recipent_name + " || Age: " + res[i].Recipent_age);
                }
                runSearch();
            });
        });
}

function donorSearch() {
    var query = "SELECT COUNT(*) FROM donor_db";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res);
        }
        runSearch();
    });
}

function agerangeSearch() {
    inquirer
        .prompt([
            {
                name: "start",
                type: "input",
                message: "Enter starting age: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "end",
                type: "input",
                message: "Enter ending age: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT Recipent_id, Recipent_name, Blood_type, Recipent_age FROM recipent_db WHERE Recipent_age BETWEEN ? AND ?";
            connection.query(query, [answer.start, answer.end], function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log(
                        "ID: " + res[i].Recipent_id + " || Name: " + res[i].Recipent_name + " || Blood Type: " + res[i].Blood_type
                        + " || Age: " + res[i].Recipent_age
                    );
                }
                runSearch();
            });
        });
}

function alphabetizedonors() {
    inquirer
    var query = "SELECT * FROM donor_db ORDER BY donor_name";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res);
        }
        runSearch();
    });




}


function alphabetizerecipents() {
    inquirer
    var query = "SELECT * FROM recipent_db ORDER BY recipent_name";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res);
        }
        runSearch();
    });

}