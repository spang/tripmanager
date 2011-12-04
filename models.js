var mongoose = require("mongoose");

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var UserSchema = new Schema({})
  , User;

var mongooseAuth = require("mongoose-auth");
// var everyauth = require('everyauth')
//   , Promise = everyauth.Promise;

var conf = require('./conf');

// everyauth.debug = true;

UserSchema.plugin(mongooseAuth, {
    everymodule: {
      everyauth: {
          User: function () {
            return User;
          }
      }
    }
  , facebook: {
      everyauth: {
          myHostname: 'http://localhost:3000'
        , appId: conf.fb.appId
        , appSecret: conf.fb.appSecret
        , redirectPath: '/'
      }
    }
  , twitter: {
      everyauth: {
          myHostname: 'http://localhost:3000'
        , consumerKey: conf.twit.consumerKey
        , consumerSecret: conf.twit.consumerSecret
        , redirectPath: '/'
      }
    }
  , password: {
        loginWith: 'email'
      , extraParams: {
            phone: String
          , name: {
                first: String
              , last: String
            }
        }
      , everyauth: {
            getLoginPath: '/login'
          , postLoginPath: '/login'
          , loginView: 'login.jade'
          , getRegisterPath: '/register'
          , postRegisterPath: '/register'
          , loginSuccessRedirect: '/'
          , registerSuccessRedirect: '/'
        }
    }
});

mongoose.connect('mongodb://localhost/ridershare');

User = mongoose.model('User', UserSchema);

// exports
exports.mongooseAuth = mongooseAuth;
