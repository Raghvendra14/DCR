const express = require('express'),
	app = express(),
	bodyParser = require('body-parser')

app.set('views', __dirname + '/views')
app.set('view engine', 'hjs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/views'))

var clients = [];
app.all('/', function (req, res, next) {
	res.render('index')
})

app.get('/request', function (req, res, next) {
	var data = {
		connId: req.query.connId,
		timeout: req.query.timeout
	}
	var timeSpent = 0;
	var timeInterval = (data.timeout < 1000) ? data.timeout : 1000;
	// console.log('Got Data')
	clients.push({
		status: 'progress',
		connId: data.connId,
		timeout: data.timeout,
		timeSpent: 0
	})
	// console.log(clients)
	var promise = new Promise(function (resolve, reject) {
		var interval = setInterval(function() {
			// console.log('Time Interval:', timeInterval)
			timeSpent += timeInterval;
			for (var i = 0; i < clients.length; i++) {
				if (clients[i].connId === data.connId) {
					if (clients[i].timeout !== timeSpent.toString() && clients[i].status === 'progress') {
						clients[i].timeSpent = timeSpent
						// console.log('Updated timeSpent:', clients[i])
					} else if (clients[i].status === 'killed') {
						// console.log('Process Killed')
						clients.splice(i, 1)
						clearInterval(interval)
						reject('NoSuccess')
					} else { // To remove the processed connection.
						clients.splice(i, 1)
						// console.log('Deleting connection data', clients)
					}
					break
				}
			}
			data.timeout -= timeInterval;
			if (data.timeout === 0) {
				clearInterval(interval)
				resolve('Success')
			}
			else if (data.timeout < 1000) {
				timeInterval = data.timeout
			}
		}, timeInterval)
	});

	promise.then(function(result) {
		// console.log('Interval over', data.connId)
		// console.log('After processing', clients)
		res.json({status: "ok", connId: data.connId})	
	}, function(result) {
		// console.log('Interval cancel')
		// console.log(clients)
		res.json({status: "killed", connId: data.connId})
	})
})

app.get('/serverStatus', function (req, res, next) {
	var result = ''
	for (const obj of clients) {
		result += '"' + obj.connId + '":"' + obj.timeSpent + '",' 
	}
	if (result.length) {
		result = result.substring(0, result.length - 1)
		// console.log(result)
	}
	res.json({result})
})

app.post('/kill', function (req, res, next) {
	var data = {
		connId: req.body.connId
	}
	var isAvailable = false;
	for (var i = 0; i < clients.length; i++) {
		if (clients[i].connId === data.connId) {
			isAvailable = true;
			if (clients[i].status === 'progress') {
				// console.log('Killable')
				clients[i].status = 'killed'
				// console.log(clients)
				res.json({status: "ok", connId: data.connId})
			} else {
				console.log('Non Killable')
			}
			break
		}
	}
	if (isAvailable === false) {
		var dataPacket = "invalid connection Id: " + data.connId.toString()
		res.json({status: dataPacket})
	}
})

app.listen(3000, function() {
	console.log('Connected to DCR HTTP Server')
}) 