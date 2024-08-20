const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')



const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Email cannot be empty'],
        unique: true, //we can not send err message insted err will respond err.code 11000
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true, 'Password cannot be empty'],
        minlength: [6, 'Minimum pssword length is 6']
    }
})

userSchema.pre('save', async function(next){
    //console.log('This user is about to register', this);

    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

userSchema.post('save', function(doc, next){
    console.log('This user is registerd', doc);
    next();
})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email});

    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error('password error')
    }
    throw Error('email error')
}

const User = mongoose.model('user', userSchema)

module.exports = User;
