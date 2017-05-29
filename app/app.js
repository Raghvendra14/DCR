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
		console.log('Got Data')
		clients.push({
			connId: data.connId,
			timeout: data.timeout,
			timeSpent: 0
		})
		console.log(clients)
		var promise = new Promise(function (resolve, reject) {
			var interval = setInterval(function() {
				console.log('Time Interval:', timeInterval)
				timeSpent += timeInterval;
				for (var i = 0; i < clients.length; i++) {
					if (clients[i].connId === data.connId) {
						if (clients[i].timeout !== timeSpent.toString()) {
							clients[i].timeSpent = timeSpent
							console.log('Updated timeSpent:', clients[i])
						} else { // To remove the processed connection.
							clients.splice(i, 1)
							console.log('Deleting connection data', clients)
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
			console.log('Interval over', data.connId)
			console.log('After processing', clients)
			socket.emit('response', {status: "ok", connId: data.connId})	
		}, function(err) {
			console.log('Interval cancel')
		})
	})

	socket.on('disconnect', function() {
		console.log('Client disconnected', socket.id)
	})
})
