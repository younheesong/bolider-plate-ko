const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds =10 //salt가 몇글자인지 (10자리)
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true, // 빈칸 스페이스 없애주는 역할
        unique:1 // email 값들 서로 중복 불가
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type: Number,
        default: 0
    }, //유저가 관리자인지 사용자인지 
    image: String,
    token :{
        type:String
    },
    tokenExp:{
        type:Number
    }
})

//index.js에서 User 객체를 사용해 save하기 전에 function 실행
//pre 기능은 mongoose 기능 중 하나임.
userSchema.pre('save', function(next){
    //비밀번호를 암호화 시키기.

    var user = this;

    // password를 수정할때만 암호화시킴. 
    if(user.isModified('password')){

    
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    }else{
        next()
    }
}) 

userSchema.methods.comparePassword = function (plainPassword, cb){

    //  plainpassword :1234567   암호화된 비밀번호 "$2b$10$edXlovKatdZvz4XJdMRln.N8WrWKH8J.b7YHo772yaGOIIMpU0bH2"
    // 요청된 패스워드를 암호화한 후 db에 있는 암호화된 비밀번호랑 같은지 확인해야 함.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){

    var user = this;

    //jsonwebtoken을 이용해서 token을 생성하기

    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // user._id + 'secretToken' = token
    //token + 'secretToken' = user._id

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}   

userSchema.statics.findByToken = function(token,cb){
    var user = this

    // 토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
       //유저 아이디를 이용해서 유저를 찾은 다음에 
       // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id":decoded, "token":token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    });
}


const User = mongoose.model('User', userSchema)

module.exports ={User}