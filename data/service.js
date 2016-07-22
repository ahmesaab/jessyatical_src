var pool = require('./db.js');
var User = require('../models/user.js');
var Listing = require('../models/listing.js');
var Application = require('../models/application.js');

Service = {
    getUserDetails:function(id,callback) {
        pool.connect(function (err, client, done) {
            if (err)
                callback(null, err);
            else {
                User.findById(id, client, function (user, err){
                    if (err) {
                        done();
                        callback(null, err)
                    }
                    else {
                        Listing.findByUser(user, client, function (listings) {
                            user.createdListings = listings;
                            User.getCompanies(id, client, function (companies) {
                                user.companies = companies;
                                Application.findByUser(user,client,function(applications){
                                    user.applications = applications;
                                    done();
                                    callback(user);
                                });
                            });
                        });
                    }
                });
            }
        });
    }
}

module.exports = Service;