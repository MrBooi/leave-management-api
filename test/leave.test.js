'use strict';
let assert = require('assert');
const pg = require('pg');
const Pool = pg.Pool;

let useSSL = false;
if (process.env.DATABASE_URL) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/leave_days_test';

const pool = new Pool({
    connectionString,
    ssl: useSSL
})

// calling user_services and request_services
const UserService = require('../services/user-service');
const RequestService = require('../services/request-services');
let user_service = UserService(pool);
let request_service =RequestService(pool);

describe('The adding new user function', () => {
    beforeEach(async () => {
    await pool.query('DELETE FROM user_leave_allowed');
    await pool.query('DELETE FROM leave_request');
    await pool.query('DELETE FROM users');
    });
    it('should add new users', async () => {
        let params = {
            first_name: 'Ayabonga',
            last_name: 'Booi',
            position: 'Fullstack dev',
            email: 'mrbooi@gmail.com',
            password: '123',
            password2: '123'
        }

        let added = await user_service.createUser(params);

        assert.equal(added, 'users is successfuly added');
    });
});


describe('The login  function', () => {
    beforeEach(async () => {
        await pool.query('DELETE FROM user_leave_allowed');
        await pool.query('DELETE FROM leave_request');
        await pool.query('DELETE FROM users');
        // await pool.query('DELETE FROM leave_type');
    });
    it('should login if users already exist', async () => {
        let params = {
            first_name: 'Ayabonga',
            last_name: 'Booi',
            position: 'Fullstack dev',
            email: 'mrbooi@gmail.com',
            password: '123',
            password2: '123'
        }
        await user_service.createUser(params);
        let loginDetails = {
            email: 'mrbooi@gmail.com',
            password: '123'
        }
        let login = await user_service.login(loginDetails);
        assert.equal(login, true);
    });
});


describe('The check if users already exist  function', () => {
    beforeEach(async () => {
        await pool.query('DELETE FROM user_leave_allowed');
        await pool.query('DELETE FROM leave_request');
        await pool.query('DELETE FROM users');
        // await pool.query('DELETE FROM leave_type');
        let params = {
            first_name: 'Siba',
            last_name: 'Qamata',
            position: 'Fullstack dev',
            email: 'siba@gmail.com',
            password: '1234',
            password2: '1234'
        }
        await user_service.createUser(params);
    });
    it('should login if users already exist', async () => {
        let params = {
            first_name: 'Siba',
            last_name: 'Qamata',
            position: 'Fullstack dev',
            email: 'siba@gmail.com',
            password: '1234',
            password2: '1234'
        }
        let reject = await user_service.createUser(params);
        assert.equal(reject, 'email already exist');
    });
});


describe('User leave amount function', () => {
    beforeEach(async () => {
        await pool.query('DELETE FROM user_leave_allowed');
        await pool.query('DELETE FROM leave_request');
        await pool.query('DELETE FROM users');
        let params = {
            first_name: 'Siba',
            last_name: 'Qamata',
            position: 'Fullstack dev',
            email: 'siba@gmail.com',
            password: '1234',
            password2: '1234'
        }
        await user_service.createUser(params);
    });
    it('should add amount of leave that a user is required to have', async () => {
      let user_id = await user_service.find_user_id('siba@gmail.com');
       let leave_amount = await user_service.addLeaveAmount(user_id);
        assert.equal(leave_amount,'Leave amount is successfully added');
    });
});


describe('apply for a leave function', () => {
    beforeEach(async () => {
        await pool.query('DELETE FROM user_leave_allowed');
        await pool.query('DELETE FROM leave_request');
        await pool.query('DELETE FROM users');
        let params = {
            first_name: 'Siba',
            last_name: 'Qamata',
            position: 'Fullstack dev',
            email: 'siba@gmail.com',
            password: '1234',
            password2: '1234'
        }
        await user_service.createUser(params);
        let user_id = await user_service.find_user_id('siba@gmail.com');
         await user_service.addLeaveAmount(user_id);
    });
    it('should return id for a leave type that exist', async () => {
        let leave_id = await request_service.leaveId('sick leave');
       assert.equal(leave_id,1);
       assert.equal(await request_service.leaveId('unpaid leave'),2);
       assert.equal(await request_service.leaveId('paid leave'),3);
       assert.equal(await request_service.leaveId('family leave'),4);
    });
    it('should return false if leave type does not exist', async () => {
        let leave_id = await request_service.leaveId('leave');
        
       assert.equal(leave_id,false);
    });
});

describe('user should apply for a leave', () => {
    beforeEach(async () => {
        await pool.query('DELETE FROM user_leave_allowed');
        await pool.query('DELETE FROM leave_request');
        await pool.query('DELETE FROM users');
        let params = {
            first_name: 'Siba',
            last_name: 'Qamata',
            position: 'Fullstack dev',
            email: 'siba@gmail.com',
            password: '1234',
            password2: '1234'
        }
        await user_service.createUser(params);
        let user_id = await user_service.find_user_id('siba@gmail.com');
         await user_service.addLeaveAmount(user_id);
    });
    it('should return id for a leave type that exist', async () => {
         let params={
            email:'siba@gmail.com',
            leaveType: 'sick leave',
            description: 'not well to day',
            start_date: '2018-10-04',
            end_date: '2018-10-06'
         }
        let apply_leave = await request_service.applyForALeave(params);

        assert.equal(apply_leave,'successfully applied for a leave')
    });
    
});





after(async () => {
    await pool.end();
});