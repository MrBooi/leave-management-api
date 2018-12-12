
module.exports =request_leave =(pool) =>{

 const applyForALeave = async (params)=>{
    const {user_id,leaveType,description,start_date,end_date} =params;
    let leave_id = await leaveId(leaveType); 
    
      if(!leave_id.success){
        return {
             success: false,
             data:'opps something went wrong'
            }
      }
     let statusID = await status_id('Pending'); 
      if (!statusID.success) {
           return {
               success:false,
               data:'status is not found'
           }
      }

       let checkAmount= await  enough_leave_days(user_id,leave_id.data,leave_days(start_date,end_date));
        console.log(checkAmount);
      if (!checkAmount.success) {
        return {
            success:false,
            data:'status is not found'
        }
      }

     await pool.query(`INSERT INTO leave_request (leave_type_id,user_id,leave_description,start_date,end_date,status_id)
      VALUES($1,$2,$3,$4,$5,$6)`
     ,[leave_id.data,user_id,description,start_date,end_date,statusID.data]);
    
     return {
           success:true,
           data:'successfully applied for a leave'
     }
 }  

 const leave_days = (start_date,end_date)=>{
   let date1 = new Date(start_date).getDay();
   let date2 = new Date(end_date).getDay();

   let total_days = date2-date1;
   if(total_days<0){
    return 'out of range';
   }
  return total_days;
 }
 
 const status_id = async (status)=>{
    let statusId = await pool.query('SELECT id FROM leave_status WHERE leave_status=$1'
    ,[status]);
    if (statusId.rowCount==0) {
        return {
            success:false,
        }
    }

    return {success:true,
            data:statusId.rows[0].id } 
 }

 const enough_leave_days= async(user_id,leave_id,amount)=>{
 let available_leave = await pool.query(`SELECT leave_amount
   From user_leave_allowed WHERE user_id=$1 
    AND leave_type_id=$2
   `,[user_id,leave_id]);
  if (available_leave.rowCount===0) {
      return {success: false,
             data:'something went wrong'}
  } 
  let leave_amount =available_leave.rows[0].leave_amount -amount;
      if(leave_amount<=0){
      return {success:false};
      }
      await pool.query(`UPDATE user_leave_allowed SET 
      leave_amount =($1) WHERE  user_id=$2 
      AND leave_type_id=$3`,[leave_amount,user_id,leave_id]);
    
      return {success:true};
 }
 

 const leaveId = async (leave_type) =>{
  let foundId = await pool.query('SELECT id FROM leave_type WHERE leave_type=$1'
  ,[leave_type])
   if (foundId.rowCount===0) {
       return {success:false};
   }
   return {success:true,
          data:foundId.rows[0].id}
          
 }

 const userId = async (email)=>{
    let foundUser = await pool.query('SELECT * FROM users WHERE email=$1'
    ,[email]);
    if (foundUser.rowCount==0) {
        return false;
    }
    return foundUser.rows[0].id;
 }

 const updateLeaveStatus = async ({id,status})=>{
    let id_status = await status_id(status);
   
    let checkLeave = await pool.query('SELECT * FROM leave_request WHERE id=$1',[id]);
     if (checkLeave.rowCount===0) {
        return {success:false,
                message:'opps invalid leave'} 
     }  
     if(status ==='Rejected'|| status==='Canceled'){
      let {leave_type_id,user_id,start_date,end_date} = checkLeave.rows[0];
       let leavedays = leave_days(start_date,end_date);
      await pool.query(`UPDATE user_leave_allowed 
             SET leave_amount=(leave_amount+$1) WHERE user_id=$2 AND leave_type_id=$3`
             ,[leavedays,user_id,leave_type_id])
     }
     await pool.query('UPDATE  leave_request SET status_id=($1) WHERE id=$2'
    ,[id_status,id]);

    return {success:true,
        message:`leave succefully set to ${status}`} 
 }


 const request_leave = async () =>{
  let leave = await pool.query('SELECT * FROM leave_request');

  return leave.rows
 }
 
 
return{
 applyForALeave,
 updateLeaveStatus,
 leaveId,
 leave_days,
 status_id,
 request_leave
}
}