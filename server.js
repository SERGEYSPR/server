var mysql = require('mysql');
var express = require('express');
var fs = require('fs');
var url = require('url');

var app = express();

app.use(app.router);
app.use(express.bodyParser());
app.use(express.cookieParser());

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

app.get('/student/add', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/add_student.html', function (err, data) {
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

// API

app.get('/api/students.get', function (req, res) {

    var params = url.parse(req.url, true).query;

    // fields
    var columns = "";
    if (params.fields !== undefined && params.fields !== "")
        columns = params.fields;
    else
        columns = "*";

    var query = "SELECT " + columns + " FROM students";

    // ids
    if (params.ids !== undefined && params.ids !== "")
    {
        var requiredIds = new String(params.ids).split(',');
        if (requiredIds.length > 0) {
            query = query.concat(" WHERE id IN (" + params.ids + ");");
        }
    }

    // console.log(query);

    var connection = mysql.createConnection({
        host: 'localhost',
        database: 'test',
        user: 'root',
        password: 'softingen205'
    });

    connection.connect(function (err) {
        if (err) console.log('error when connecting to db:', err);
    });

    connection.query(query, function (err, rows, fields) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

        if (err) {
            var errorResponse = { error: { message: err.message } };
            res.end(JSON.stringify(errorResponse));
        }
        else {
            res.end(JSON.stringify(rows));
        }
    });

    connection.end();
});

app.get('/api/students.add', function (req, res) {
	
	var connection = mysql.createConnection({
   	    host: 'localhost',
        database: 'test',
        user: 'root',
        password: 'softingen205'
    });
    
	res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

    connection.connect(function (err) {
        if (err) {
            var response = { status: 'error', message: err.message };
            res.end(JSON.stringify(response));
            return;
        }
    });
    
    var params = url.parse(req.url, true).query;

    if (params.card_number === undefined || params.card_number === '' ||
        params.first_name === undefined  || params.first_name === '' ||
        params.second_name === undefined || params.second_name === '' ||
        params.middle_name === undefined || params.middle_name === '')
    {
        var response = { status: 'error', message: 'Some of the required fields are not filled.' };
        res.end(JSON.stringify(response));
        return;
    }

    var columns = "";
    var values = "";

    // Card number
    columns = columns.concat('card_number');
    values = values.concat(params.card_number);

    // Second name
    columns = columns.concat(',second_name');
    values = values.concat(',' + params.second_name);

    // First name
    columns = columns.concat(',first_name');
    values = values.concat(',' + params.first_name);

    // Middle name
    columns = columns.concat(',middle_name');
    values = values.concat(',' + params.middle_name);

    res.end('(' + columns + ') (' + values + ')');

    /*
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

	connection.end();*/
});

app.get('/api/students.delete', function (req, res) {

    var connection = mysql.createConnection({
   	    host: 'localhost',
        database: 'test',
        user: 'root',
        password: 'softingen205'
    });
    
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

    connection.connect(function (err) {
        if (err) {
            var response = { status:'error', message: err.message };
            res.end(JSON.stringify(response));
            return;
        }
    });
    
    var params = url.parse(req.url, true).query;

    if (params.id === undefined || params.id === '') {
        var response = { status: 'error', message: err.message };
        res.end(JSON.stringify(response));
        return;
    }

    if (new String(params.id).match(new RegExp("^([0-9]+)$")) === null) {
        var response = { status: 'error', message: err.message };
        res.end(JSON.stringify(response));
        return;
    }

    var query = "DELETE FROM students WHERE id=" + params.id + ";";

    console.log(query);
    connection.query(query, function (err, rows, fields) {
        if (err || rows.affectedRows === 0) {
            var response = { status: 'error', message: 'Id ' + params.id + ' is not exist' };
            res.end(JSON.stringify(response));
        }
        else {
            var response = { status: 'success' };
            res.end(JSON.stringify(response));
        }
    });
});

app.get('/api/classrooms.get', function (req, res) {

    var connection = mysql.createConnection({
        host: 'localhost',
        database: 'test',
        user: 'root',
        password: 'softingen205'
    });

    connection.connect(function (err) {
        if (err) console.log('error when connecting to db:', err);
    });

    connection.query('SELECT * FROM classrooms;', function (err, rows, fields) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

        if (err) {
            var errorResponse = { error: { message: err.message } };
            res.end(JSON.stringify(errorResponse));
        }
        else {
            res.end(JSON.stringify(rows));
        }
    });

    connection.end();
});

app.get('/api/classrooms.add', function (req, res) {

    var connection = mysql.createConnection({
        host: 'localhost',
        database: 'test',
        user: 'root',
        password: 'softingen205'
    });

    connection.connect(function (err) {
        if (err) {
            sendError(res, 403, err.message);
            return;
        }
    });

    var params = url.parse(req.url, true).query;
    
    if (params.faculty === undefined || params.faculty === '') {
        sendError(res, 403, "'faculty' fuild is not set");
        return;
    }

    if (params.building_number === undefined || params.building_number === '') {
        sendError(res, 403, "'building_number' fuild is not set");
        return;
    }

    if (params.classroom_number === undefined || params.classroom_number === '') {
        sendError(res, 403, "'classroom_number' fuild is not set");
        return;
    }

    if (params.type_of_classes === undefined || params.type_of_classes === '') {
        sendError(res, 403, "'type_of_classes' fuild is not set");
        return;
    }

    if (params.has_multimedia_set === undefined || params.has_multimedia_set === '') {
        sendError(res, 403, "'has_multimedia_set' fuild is not set");
        return;
    }

    if (params.has_board === undefined || params.has_board === '') {
        sendError(res, 403, "'has_board' fuild is not set");
        return;
    }
    
    var query = "INSERT INTO classrooms (faculty, building_number, classroom_number, type_of_classes, has_multimedia_set, has_board) " +
                "VALUES (" + 
                params.faculty + ", " +
                params.building_number + ", " +
                params.classroom_number + ", " +
                params.type_of_classes + ", " +
                params.has_multimedia_set + ", " +
                params.has_board + ");";

    console.log(query);

    connection.query(query, function (err, rows, fields) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

        if (err) {
            var errorResponse = { error: { message: err.message } };
            res.end(JSON.stringify(errorResponse));
        }
        else {
            res.end(JSON.stringify(rows));
        }
    });

    connection.end();
});

// HELP

app.get('/help', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/help/help.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/help/students.get', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/help/students.get.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/help/students.add', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/help/students.add.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/help/students.delete', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/help/students.delete.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/help/lecturers.get', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/help/lecturers.get.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/help/lecturers.add', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/help/lecturers.add.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/help/lecturers.delete', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/help/lecturers.delete.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/help/classrooms.get', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/help/classrooms.get.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/help/classrooms.add', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/help/classrooms.add.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});

app.get('/help/classrooms.delete', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    fs.readFile(__dirname + '/help/classrooms.delete.html', function (err, data) {
        if (err) { res.end('error'); return; }

        res.end(data.toString('utf-8'));
    });
});


app.listen(80);

console.log('Server running');

function sendError(res, errorCode, errorMessage) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(JSON.stringify({ status: 'error', code: errorCode, message: errorMessage }));
}