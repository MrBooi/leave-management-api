const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const User_Services = require('./services/user-service');
const Leave_Services = require('./services/request-services');
const User_Routes  = require('./routes/user_Routes');
const Leave_Routes = require('./routes/request_leave_routes');
const pg = require('pg');

const app = express(); 
app.use(cors());

let PORT = process.env.PORT || 3000;

app.use(express.static('public'));
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true
// }));

// app.use(flash());

//database connection 
const Pool = pg.Pool;
let useSSL = false;
if (process.env.DATABASE_URL) {
    useSSL = true;
}
// need to change database to the original database not test
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/leave_days_test'

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

const user_Services = User_Services(pool);
const user_Routes   = User_Routes(user_Services);
const request_Services = Leave_Services(pool);
const request_Routes   = Leave_Routes(request_Services);

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("hello world Leave Management app is working");
})
//  @signIn
//  Post request
//  allows user login 
app.post('/api/signIn', user_Routes.handleSignIN);
//  @addUser
//  Post request
//  allows user to register if they dont have account 
app.post('/api/addUser', user_Routes.HandleAddUser);
//  @leave/Amount
//  Post request
//  will added leave amount once the user register
app.post('/api/leave/Amount/:userId', user_Routes.HandleAddLeaveAmount);

//  @request/leave
//  Post request
// allow user to apply for a leave
  app.post('/api/request/leave', request_Routes.handleNewLeave);
//  @update/leave/status/:id/:status
//  Post request
// allow user to cancel a leave status and also allow Manager to update user status
app.post('/api/update/leave/status/:id/:status',request_Routes.handleLeaveUpdate);

//  @/api/user/applied/leaves/:user_id
//  Get request
//  It will find all the applied leaves for a user
app.get('/api/user/applied/leaves/:user_id',user_Routes.HandleAppliedLeave);


app.listen(PORT, () => console.log('App starting on port', PORT))