const loginErrors = require('../validation/login');
let bcrypt = require('bcryptjs');

module.exports = user = (pool) => {
   
    const login = async ({email, password}) => {
        let loginData = {
            email,
            password
        };
        let error = loginErrors(loginData);
        if (!error.isValid) {
            return error.errors;
        }

        let login = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (login.rowCount == 0) {
            return false;
        }
        const {user_password} = login.rows[0];

         if (!decrytPass(password,user_password)) {
             return false
         }
         return true;

  
    }

    const findEmail = async (email) => {
        let foundUser = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (foundUser.rowCount == 0) {
            return false;
        } 
        
        return true;
    }

    const createUser = async (params) => {
        const {
            first_name,
            last_name,
            position,
            email,
            password,
            password2
        } = params
        let alreadyExist = await findEmail(email);

        if (alreadyExist) {
            return 'email already exist';
        }   
         const hash = encrytPass(password);
        await pool.query(`INSERT INTO users (first_name,last_name,position,email,user_password)
          VALUES ($1,$2,$3,$4,$5)`, [first_name, last_name, position, email, hash])
          
        return 'users is successfuly added';
    }

    const encrytPass = (password) => {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        return hash
    }

    const decrytPass = (password,hash) => {
     let correctPass = bcrypt.compareSync(password, hash); 
       return correctPass;
    }

    const addLeaveAmount = async (userid) => {
    let leave_type = leave_amount(); 
    for (const currect_type of leave_type) {
         const {leave_type, amount} = currect_type;
         const leave_type_id = await find_leavetype_id(leave_type);
          if(leave_type_id <0){
          return 'leave type is not found';
          }

       await pool.query(`INSERT INTO user_leave_allowed
        (user_id,leave_type_id,leave_amount) 
        VALUES ($1,$2,$3)`,[userid,leave_type_id,amount]);
    }

     return 'Leave amount is successfully added';
    }
    
    const leave_amount =() => {
        let leaveAmount = [{
                leave_type: 'sick leave',
                amount: 3
            }, {
                leave_type: 'unpaid leave',
                amount: 8
            }, {
                leave_type: 'paid leave',
                amount: 7
            }
            , {
                leave_type: 'family leave',
                amount: 3
            }
        ]
        return leaveAmount;
    } 
     
    const find_user_id = async (email) =>{
       let user_id = await pool.query('SELECT id FROM users Where email=$1',[email])
        if (user_id.rowCount==0) {
        return 'oops user does not exist';
        }

        return user_id.rows[0].id;
    }


    const find_leavetype_id= async (leave_type) =>{
     let find_id = await pool.query('SELECT id from leave_type WHERE leave_type=$1',[leave_type]);
     if (find_id.rowCount===0) {
          return 'Leave type is undefined';
      } 
      return find_id.rows[0].id;
    }
    
    return {
        login,
        createUser,
        addLeaveAmount,
        find_user_id
    }
}