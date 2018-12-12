
const request_leave =(request_Services)=>{

const handleNewLeave = (req,res)=>{
    try { 
         const {user_id,leaveType,description,start_date,end_date}= req.body;
         let params ={
             user_id: Number(user_id),
            leaveType,
            description,
            start_date,
            end_date
         }
         
        let requestLeave = request_Services.applyForALeave(params);
         
           if (requestLeave.isvalid) {
            res.json({status:'error',error:requestLeave.errors});
           }
           res.json({status:'success',message:'Succefully applied for leave'})
    } catch (error) {
        res.json({status:'error'})
    }
} 

const handleLeaveUpdate =(req,res)=>{
    try {
        const {id,status}= req.params;
       let changeStatus = request_Services.updateLeaveStatus({id,status});
       if (changeStatus.isvalid) {
         res.json({status:'error',error:changeStatus.errors});
       }
       res.json({status:'success',data:changeStatus});
    } catch (error) {
      res.json({status:'error'})
    }
}

return{
    handleNewLeave,
    handleLeaveUpdate
}
}

module.exports = request_leave;