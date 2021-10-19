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
                "Find donor by name",
                "Find recipent age within a specific range",
                "Search for a specific donor id",
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


                case "Find donor by name":
                    donorSearch();
                    break;

                case "Find recipent age within a specific range":
                    rangeSearch();
                    break;

                case "Search for a specific donor id":
                    idSearch();
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
            var query = "SELECT Donor_id, Donor_name, Donor_age FROM donor_db WHERE ?";
            connection.query(query, { Blood_type: answer.Blood_type }, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log("ID: " + res[i].Donor_id + " || Name: " + res[i].Donor_name + " || Age: " + res[i].Donor_age);
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

function multiSearch() {
    var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].artist);
        }
        runSearch();
    });
}

function rangeSearch() {
    inquirer
        .prompt([
            {
                name: "start",
                type: "input",
                message: "Enter starting position: ",
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
                message: "Enter ending position: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
            connection.query(query, [answer.start, answer.end], function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log(
                        "Position: " +
                        res[i].position +
                        " || Song: " +
                        res[i].song +
                        " || Artist: " +
                        res[i].artist +
                        " || Year: " +
                        res[i].year
                    );
                }
                runSearch();
            });
        });
}

function songSearch() {
    inquirer
        .prompt({
            name: "song",
            type: "input",
            message: "What song would you like to look for?"
        })
        .then(function (answer) {
            console.log(answer.song);
            connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function (err, res) {
                if (err) throw err;
                console.log(
                    "Position: " +
                    res[0].position +
                    " || Song: " +
                    res[0].song +
                    " || Artist: " +
                    res[0].artist +
                    " || Year: " +
                    res[0].year
                );
                runSearch();
            });
        });
}
