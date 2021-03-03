const mongoose = require('mongoose')

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

const User = mongoose.model('User', userSchema)

module.exports ={User}