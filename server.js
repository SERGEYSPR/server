﻿var mysql = require('mysql');
var express = require('express');
var fs = require('fs');

var app = express();

app.use(app.router);
app.use(express.bodyParser());
app.use(express.cookieParser());

app.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('Hello!');
});

app.get('/students', function (req, res) {
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

app.get('/add.student', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/add_student.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/api/student/get', function (req, res) {

    var connection = mysql.createConnection({
        host: 'localhost',
        database: 'test',
        user: 'root',
        password: 'softingen205'
    });

    connection.connect(function (err) {
        if (err) console.log('error when connecting to db:', err);
    });

    connection.query('SELECT * FROM students;', function (err, rows, fields) {
        if (err) throw err;

        res.writeHead(200, { 'Content-Type': 'text/json; charset=utf-8' });
        res.end(JSON.stringify(rows));
    });
});

app.post('/api/student/add', express.bodyParser(), function (req, res) {
	
	var connection = mysql.createConnection({
   	host: 'localhost',
      database: 'test',
      user: 'root',
      password: 'softingen205'
   });
   
   connection.connect(function (err) {
   	if (err) console.log('error when connecting to db:', err);
   });
   
	res.writeHead(200, { 'Content-Type': 'text/json; charset=utf-8' });    

	if (req.body.FirstName === undefined) { res.end("First name must be not null"); return; }
	if (req.body.SecondName === undefined) { res.end("Second name must be not null"); return; }
	if (req.body.MiddleName === undefined) { res.end("Middle name must be not null"); return; }
   
   var query = "insert into students (FirstName, SecondName, MiddleName) " + 
   				"values('" + req.body.FirstName + "', '" + req.body.SecondName + "', '" + req.body.MiddleName + "');"
   
   connection.query(query, function (err, rows, fields) {
   	if (err) res.end("" + err);
      res.end("OK");
   });
});

app.post('/api/student/delete', express.bodyParser(), function (req, res) {
	
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