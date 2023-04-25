const User= require('../models/user');
const fs = require('fs');
const path = require('path');


//no need of async+await as only 1 callback is there
module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });

}


module.exports.update=async function(req,res)
{

// if(req.user.id=req.params.id)
// {
// User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
// return res.redirect('back');

// });
// }else{
// return res.status(401).send('Unauthorized');
// }
if(req.user.id==req.params.id){
try{
let user=await User.findById(req.params.id);
User.uploadedAvatar(req,res,function(err){
if(err){
console.log('multer error',err);
}

user.name=req.body.name;
user.email=req.body.email;
if(req.file){
if(user.avatar){
fs.unlinkSync(path.join(__dirname,'..',user.avatar));
}
user.avatar=User.avatarPath+'/'+req.file.filename;
}
user.save();
return res.redirect('back');



});
}
catch(err){
req.flash('error',err);
return res.redirect('back');

}

}else{
return res.status(401).send('Unauthorized');
}

}
 
 
 
//rendering signUp page
module.exports.signUp=function(req,res)
{
  if(req.isAuthenticated())
  {
    return res.redirect('/users/profile');
  }
      return res.render('user_sign_up',
      {
      	title:"Codeial/signUp"
      });
}

//rendering signIn page
module.exports.signIn=function(req,res)
{
  if(req.isAuthenticated())
  {
    return res.redirect('/users/profile');
  }
      return res.render('user_sign_in',
      {
      	title:"Codeial/signIn"
      });
}



// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }

    });
}


//get the signin data and create a session for the user

module.exports.createSession=function(req,res)
{
    req.flash('success', 'Logged in Successfully')
	return res.redirect('/');

}
module.exports.destroySession = function(req, res){
    req.logout(function(err){
    if (err) { return next(err); }
    req.flash('success', 'You have logged out!');

    res.redirect('/');
  });
  }

