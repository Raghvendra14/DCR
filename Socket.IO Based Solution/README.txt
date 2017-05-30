##README##

Instructions to run the code:
1) Install Node.js
2) Go to the app directory in Command Prompt
3) Run the command: npm install
4) After the completion of above command, run the following command: node app.js
5) Open the following link in a browser: http://localhost:3000/
6) There are three forms- a) For inserting a connection id and timeout
						  b) For getting all concurrent connections
						  c) For deleting a concurrent connection

##NOTE##
1) Please insert all the unique concurrent ids in insert form.
2) Please keep in mind that it's a Socket.IO based server and you'd need to perform insertion of ids seperately in different tabs or browsers for concurrent processing. (Rest of the actions can be performed in the same socket or tab of browser.)
3) Please make sure that you are connected to Internet because of loading of the AngularJS CDN and Bootstrap CDN.
4) Don't reload or close the page for the time you entered as timeout while inserting connection id and timeout.