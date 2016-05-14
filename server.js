var express = require('express');
var app = express();
var exec = require('child_process').exec,
    child;
var fs = require('fs');
var mysql = require('mysql');
var xmlparser = require('express-xml-bodyparser');
var path = require('path');

app.use(xmlparser());
app.use(express.static(path.join(__dirname, 'public')));


var pool = mysql.createPool({
    connectionLimit: 4,
    host: 'ap-cdbr-azure-east-c.cloudapp.net',
    user: 'b84f63acd57725',
    password: '7ac4448d',
    database: 'seneru'
});


app.post('/getSvg', function(req, res) {

    fs.writeFile("xmlSchema", req.rawBody, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");

        child = exec('java -jar dist/lib/xsdvi.jar xmlSchema',
            function(error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                    return;
                }
                fs.readFile('xmlSchema.svg', function read(err, img) {
                    if (error !== null) {
                        console.log('exec error: ' + error);
                        return;
                    }
                    res.writeHead(200, {
                        'Content-Type': 'image/svg+xml'
                    });
                    res.end(img, 'binary');
                });
            });
    });
});

app.get('/getDbStructure', function(req, res) {

    var database = {};

    getTables("SHOW TABLES IN seneru", function(err, tables) {
        if (err) {
            res.json({
                error: err
            });
        } else {
            var tablesFields = {};

            tables.forEach(function(table) {

                getFields(table, function(err, table, fields) {
                    if (err) {
                        res.json({
                            error: err
                        });
                    } else {

                        tablesFields[table] = fields;

                        if (tables.length == getAssociateArrayLength(tablesFields)) {
                            console.log(tablesFields);
                            database.tables = JSON.parse(JSON.stringify(tablesFields));
                            res.json({
                                database: database
                            });
                        }

                    }
                })

            }, this);
        }
    });

});

app.get('/ping', function(req, res) {

    res.json({
        response: "pong"
    });
});



app.get('/', function(req, res) {

    res.end("WELCOME XSD TO SVG API!");
});

//process.env.PORT

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("The server is running on port " + port);
});


function getTables(query, callback) {
    pool.getConnection(function(err, connection) {
        connection.query(query, function(err, rows) {
            connection.release();
            if (err) {
                throw err;
                console.log("error ", err);
                callback(err, null);
            } else {
                var tables = [];
                rows.forEach(function(row) {
                    var tableName = row.Tables_in_seneru;
                    tables.push(tableName);
                }, this);
                callback(null, tables);
            }
        });
    });
}

function getFields(table, callback) {
    pool.getConnection(function(err, connection) {
        connection.query("DESCRIBE " + table, function(err, rows) {

            connection.release();
            if (err) {
                throw err;
                console.log("error ", err);
                callback(err, null, null);
            } else {
                var fields = {};
                rows.forEach(function(row) {
                    fields[row.Field] = row.Type;
                }, this);
                //console.log(fields);
                callback(null, table, fields);
            }
        });
    });
}

function getAssociateArrayLength(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}