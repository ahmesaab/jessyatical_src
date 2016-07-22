var pool = require('./db.js');
var User = require('dao/user.js');
var Listing = require('dao/listing.js');
var Application = require('dao/application.js');

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
                                    callback(user);
                                    done();
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