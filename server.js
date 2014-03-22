var mysql = require('mysql');
var express = require('express');
var fs = require('fs');
var url = require('url');

var app = express();

app.use(app.router);
app.use(express.bodyParser());
app.use(express.cookieParser());

// Global variables
var studentFields = [
    'id', 'card_number', 'second_name', 'first_name', 'middle_name', 'birthday',
    'country', 'region', 'district', 'city', 'town', 'street', 'house', 'flat',
    'document_type', 'document_series', 'document_number', 'document_date', 'document_orden',
    'faculty', 'year', 'category', 'motion', 'order_date', 'order_number'];


app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/student/get', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/student_list.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/statement', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/statement.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/student/add', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/add_student.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/api/students.get', function (req, res) {

    var params = url.parse(req.url, true).query;
    
    // fields parsing
    var columns = "";
    var fieldRegex = new RegExp('^([a-z_]+)$');

    if (params.fields !== undefined && params.fields !== "")
    {
        var requiredFields = new String(params.fields).toLowerCase().split(',');

        for (var i = 0; i < requiredFields.length; i++)
        {
            var field = requiredFields[i].trim();
            if (field.match(fieldRegex) === null)
                continue;

            for (var j = 0; j < studentFields.length; j++)
            {
                if (field === studentFields[j]) {
                    columns = columns.concat(((i === 0) ? "" : ","), field);
                }
            }
        }
    }
    
    console.log(columns);

    var connection = mysql.createConnection({
        host: 'localhost',
        database: 'test',
        user: 'root',
        password: 'softingen205'
    });

    connection.connect(function (err) {
        if (err) console.log('error when connecting to db:', err);
    });

    connection.query('SELECT ' + columns + ' FROM students;', function (err, rows, fields) {
        if (err) throw err;

        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(JSON.stringify(rows));
    });

    connection.end();
});

app.post('/api/students.add', express.bodyParser(), function (req, res) {
	
	var connection = mysql.createConnection({
   	    host: 'localhost',
        database: 'test',
        user: 'root',
        password: 'softingen205'
    });
   
    connection.connect(function (err) {
        if (err) console.log('error when connecting to db:', err);
    });
   
	/*if (req.body.FirstName === undefined) { res.end("First name must be not null"); return; }
	if (req.body.SecondName === undefined) { res.end("Second name must be not null"); return; }
	if (req.body.MiddleName === undefined) { res.end("Middle name must be not null"); return; }*/
   
    console.log(req.body.FirstName);
	var query = "insert into students (SecondName, FirstName, MiddleName, Birthday, Country, Region, City, District, Town, Street, House, Flat, Phone) " +
   				"values('" +
                    req.body.FirstName + "', '" +
                    req.body.SecondName + "', '" +
                    req.body.MiddleName + "', '" +
                    req.body.Birthday + "', '" +
                    req.body.Country + "', '" +
                    req.body.Region + "', '" +
                    req.body.City + "', '" +
                    req.body.District + "', '" +
                    req.body.Town + "', '" +
                    req.body.Street + "', '" +
                    req.body.House + "', " +
                    req.body.Flat + ", '" +
                    req.body.Phone +
                "');"
   
	connection.query(query, function (err, rows, fields) {

        if (err) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(err.toString());
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end();
        }
	});

	connection.end();
});

app.post('/api/students.delete', express.bodyParser(), function (req, res) {
	
	var connection = mysql.createConnection({
   	host: 'localhost',
      database: 'test',
      user: 'root',
      password: 'softingen205'
   });
   
   connection.connect(function (err) {
   	if (err) console.log('error when connecting to db:', err);
   });
   
	res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });    

	if (req.body.Id === undefined) { res.end("Id of removing student must be not null"); return; }
   
   var query = "delete from students where Id=" + req.body.Id + ";";
   console.log(req.body.Id);
   connection.query(query, function (err, rows, fields) {
   	if (err) res.end("" + err);
      res.end("OK");
   });
});

app.listen(80);

console.log('Server running');