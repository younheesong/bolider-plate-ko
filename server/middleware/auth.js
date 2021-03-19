const { User } = require("../models/User");


let auth = (req, res, next) =>{
    //인증 처리를 하는 곳

    // client 쿠키에서 토큰을 가져옴.
    let token = req.cookies.x_auth; // 저번에 쿠키에 토큰 넣을때 "x_auth"에 넣었음.
    
    //'secretToken'을 이용해(토큰을 복호화) 유저(유저 아이디)를 찾음
    User.findByToken(token, (err, user)=>{
        if(err) throw err;
        if(!user) return res.json({isAuth:false, error:true})

        req.token = token; // req에 token과 user을 넣어주는 이유 = index.js에서 req.token과 req.user를 사용할 수 있게 하기 위해
        req.user = user;
        next(); //next가 없으면 미들웨어에 멈쳐버림
    })


    // 유저가 있으면 인증 okay

    // 유저가 없으면 인증 no!
}

module.exports = {auth};