 module.exports = user = (pool) => {

    const login = async ({email,password})=>{
        let login = await pool.query('SELECT * FROM users WHERE email=$1 and PASS_WORD=$2 '
          ,[email,password]);
          if(login.rowCount==0){
              return false;
          }
          return true;
       }

       const findEmail = async (email) =>{
        let foundUser = await pool.query('SELECT email FROM users WHERE email=$1'
        ,[email]);
         if (foundUser.rowCount==0) {
             return false;
         }
         return true;
    }
    
    
    const createUser = async(params)=>{
    const {first_name,last_name,position,email,password,password2}=params
      let alreadyExist = await findEmail(email); 
      
         if (alreadyExist) {
             return 'email already exist';
         }
         await pool.query(`INSERT INTO users (first_name,last_name,position,email,PASS_WORD)
          VALUES ($1,$2,$3,$4,$5)`,[first_name,last_name,position,email,password]
         )
    
         return 'users is successfuly added';
    }

    const encrytPass = (password)=>{
       let hash ='';
     return hash
    }

    const decrytPass = (password)=>{
        let originalPassword =  ''
      return originalPassword
     }
    

  return{
      login,
      createUser
  }
 }




