var mongoose = require("mongoose");

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Person = new Schema({
    name        : String,
    email       : String,
    leader      : Boolean,
    leader_type : String,   // null/empty if they're not a leader
});

var Trip = new Schema({
    name        : String,
    start_date  : Date,
    end_date    : Date,
    description : String,
    signup_start: String, // no datetime type?
    signup_end  : String, // no datetime type?
    early_drivers: Number, // can be 0
    early_signup_start : String, // no datetime type? can be undef
    trip_fee    : Number,
    leader      : Person,
});

mongoose.connect('mongodb://localhost/tripmanager');
