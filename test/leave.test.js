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

// calling waiter factrory function 
const UserService = require('../services/user-service');
let user_service = UserService(pool);

describe('The adding new user function', () => {
    beforeEach(async () => {
        //     // await pool.query('DELETE FROM request_leave');
        await pool.query('DELETE FROM users');
        //     await pool.query('DELETE FROM leave_type');
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
        //     await pool.query('DELETE FROM request_leave');
        await pool.query('DELETE FROM users');
        //     await pool.query('DELETE FROM leave_type');
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
        //     await pool.query('DELETE FROM request_leave');
        await pool.query('DELETE FROM users');
        //     await pool.query('DELETE FROM leave_type');
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










after(async () => {
    await pool.end();
});