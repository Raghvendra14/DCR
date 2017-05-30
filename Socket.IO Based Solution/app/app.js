const express = require('express'),
	app = express(),
	bodyParser = require('body-parser')

const server = app.listen(3000, function() {
	console.log('Connected to DCR Socket.io Server')
}) 

const io = require('socket.io')(server)

app.set('views', __dirname + '/views')
app.set('view engine', 'hjs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/views'))

var clients = [];
app.all('/', function (req, res, next) {
	res.render('index')
})

io.on('connection', function(socket) {
	console.log('Client Connected', socket.id)
	socket.on('request', function(data) {
		var timeSpent = 0;
		var timeInterval = (data.timeout < 1000) ? data.timeout : 1000;
		clients.push({
			status: 'progress',
			connId: data.connId,
			timeout: data.timeout,
			timeSpent: 0
		})
		var promise = new Promise(function (resolve, reject) {
			var interval = setInterval(function() {
				timeSpent += timeInterval;
				for (var i = 0; i < clients.length; i++) {
					if (clients[i].connId === data.connId) {
						if (clients[i].timeout !== timeSpent.toString() && clients[i].status === 'progress') {
							clients[i].timeSpent = timeSpent
						} else if (clients[i].status === 'killed') {
							clients.splice(i, 1)
							clearInterval(interval)
							reject('NoSuccess')
						} else { // To remove the processed connection.
							clients.splice(i, 1)
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
			socket.emit('response', {status: "ok", connId: data.connId})	
		}, function(result) {
			socket.emit('response', {status: "killed", connId: data.connId})
		})
	})

	socket.on('get-status', function() {
		var result = ''
		for (const obj of clients) {
			result += '"' + obj.connId + '":"' + obj.timeSpent + '",' 
		}
		if (result.length) {
			result = result.substring(0, result.length - 1)
		}
		socket.emit('status', {result})
	})

	socket.on('kill-connId', function(data) {
		var isAvailable = false;
		for (var i = 0; i < clients.length; i++) {
			if (clients[i].connId === data.connId) {
				isAvailable = true;
				if (clients[i].status === 'progress') {
					clients[i].status = 'killed'
					socket.emit('killed', {status: "ok", connId: data.connId})
				} else {
					console.log('Non Killable')
				}
				break
			}
		}
		if (isAvailable === false) {
			var dataPacket = "invalid connection Id: " + data.connId.toString()
			socket.emit('killed', {status: dataPacket})
		}
	})

	socket.on('disconnect', function() {
		console.log('Client disconnected', socket.id)
	})
})
