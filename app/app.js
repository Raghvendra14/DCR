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
		var promise = new Promise(function (resolve, reject) { 
			setTimeout(function() {
				resolve('Success')
			}, data.timeout)	
		});

		promise.then(function(result) {
			console.log('Timeout occured', data.connId)
			socket.emit('response', {status: "ok", connId: data.connId})	
		}, function(err) {
			console.log('Timeout cancel')
		})

		console.log('Got Data')
		clients.push(data)
		console.log(clients)
	})

	socket.on('disconnect', function() {
		console.log('Client disconnected', socket.id)
	})
})
