const user_route = (user_Services) => {

  const handleSignIN = async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;
      let loginData = {
        email,
        password
      }
      let signin = await user_Services.login(loginData);

      if (!signin.success) {
        return res.json({
          status: 'error',
          data: signin
        })
      }

      return res.json({
        status: 'success',
        data: signin
      })
    } catch (e) {
      return res.json({
        status: 'error',
        message: 'opps sommething happened'
      });
    }
  }

  const HandleAddUser = async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        position,
        email,
        password,
        password2
      } = req.body;
      let params = {
        first_name,
        last_name,
        position,
        email,
        password,
        password2
      }
      let userData = await user_Services.createUser(params)
      if (!userData.success) {
        return res.json({
          status: 'error',
          data: userData
        })
      }
      return res.json({
        status: 'success',
        data: userData
      })
    } catch (error) {
      return res.json({
        status: 'error'
      })
    }
  }

  const HandleAddLeaveAmount = async (req, res) => {
    try {
      const {
        userId
      } = req.params;
      let leave_amount = await user_Services.addLeaveAmount(userId);
      if (!leave_amount) {
        res.json({
          status: 'error',
          message: 'Is not added'
        })
      }
      res.json({
        status: 'success',
        message: 'leave amount is added succefuly'
      })
    } catch (error) {
      res.json({
        status: 'error'
      })
    }

  }

  const HandleAppliedLeave = async (req,res)=>{
   try {
     const {user_id} = req.params;
    let userLeaves = await user_Services.user_leaves(user_id);
      if (!userLeaves.success) {
         return res.json({success:false,
                 message: 'oops we dont have any leaves for you',data:[]})
      }
      return res.json({
        success:true,
        data:userLeaves.data
      })
  

   } catch (error) {
     return res.json({success:false,
      data: 'oops something went wrong'});
   }
  }

  return {
    handleSignIN,
    HandleAddUser,
    HandleAddLeaveAmount,
    HandleAppliedLeave
  }
}

module.exports = user_route;