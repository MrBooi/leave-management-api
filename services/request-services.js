module.exports = leaveDays =>{

 const applyForALeave = async (params)=>{
    const {email,leaveType,description,start_date,end_date} =params;
     let user_id = await userId(email);
     let leave_id = await leaveId(leaveType); 
     if (leave_id===false && userId ===false) {
         return 'opps something went wrong';
     }
     await pool.query(`INSERT INTO request_leave (leave_id,users_id,Description,start_date,end_date)
      VALUES($1,$2,$3,$4)`
     ,[leave_id,user_id,description,start_date,end_date]);
      return 'successfully applied for a leave';
 }   
      
 const leaveId =(typeOfAleave) =>{
  let foundId = await pool.query('SELECT id FROM leave_type WHERE leave_type=$1'
  ,[typeOfAleave])
   if (foundId.rowCount===0) {
       return false;
   }
   return foundId.rows[0].id;
 }

 const userId = (email)=>{
    let foundUser = await pool.query('SELECT * FROM users WHERE email=$1'
    ,[email]);
    if (foundUser.rowCount==0) {
        return false;
    }
    return foundUser.rows[0].id;
 }

 const updateLeaveStatus = async (status,id)=>{
    await pool.query('UPDATE status request_leave SET status=$1 WHERE id=$2'
    ,[status,id]);

    return `leave succefully to ${status}`;
 }

 

return{
 applyForALeave,
 updateLeaveStatus
}

}