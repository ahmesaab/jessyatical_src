var pool = require('./db.js');
var User = require('./dao/user.js');
var Listing = require('./dao/listing.js');
var Application = require('./dao/application.js');
var Utils = require('./utils');

var pageSize = 4;

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
                        // Get the latest 5 listings of the user
                        Listing.findByUser(user, client, function (listings) {
                            user.createdListings = listings;
                            // Get the user's companies maximum 5 entries
                            User.getCompanies(id, client, function (companies) {
                                user.companies = companies;
                                // Get the user's latest 5 applications and their listing details
                                Application.findByUser(user,client,function(applications){
                                    user.applications = applications;
                                    // call the callback function with the generated JSON
                                    callback(user);
                                    // release the connection.
                                    done();
                                });
                            });
                        });
                    }
                });
            }
        });
    },
    getTopActiveUsers:function(page,callback) {
        pool.connect(function (err, client, done) {
            if (err)
                callback(null, err);
            else if (Utils.isPositiveInt(page)) // validate page number
            {
                var date = Utils.dateBySubtractingDays(new Date(),7);

                // Get the count of applied listing for all users starting for the last week
                // then gets the top three applied listings for the users in the current page.
                // Combines the two JSONs returned into a single reply JSON then calls the callback

                client.query('SELECT u.*, COUNT(a.id) as count FROM applications a RIGHT JOIN ' +
                'users u ON u.id = a.user_id WHERE a.created_at > $1::timestamp GROUP BY u.id ' +
                'ORDER BY count DESC OFFSET '+(page-1)*(pageSize)+' ROWS FETCH NEXT '+ pageSize +
                ' ROWS ONLY',[date], function(err, result) {
                    if(err)
                    {
                        console.log(err);
                        callback(null,err,500);
                    }
                    else
                    {
                        var users = result.rows;
                        if(users.length!=0)
                        {
                            // Getting an array of the current user ids in the page.
                            var userIds = [];
                            for( var i=0;i<users.length;i++) {
                                userIds.push(users[i].id);
                                users[i].listing = [];
                            }

                            // Given the list of user ids in the current page find the top three listings
                            // of these users and combines them with the old JSON.
                            Application.findTopAppliedListingNamesByUsers(userIds,client,function(listings) {
                                for(var i=0; i < listings.length; i++){
                                    var user = users.filter( function( obj ) {
                                        return obj.id == listings[i].user_id;
                                    })[0];
                                    if(user.listing.length < 3)
                                        user.listing.push(listings[i].name);
                                }
                                callback(users);
                            });
                        }
                        else {
                            callback(null,"page not found",404)
                        }
                    }
                });
            }
            else
            {
                callback(null,"page is not valid",500);
            }
        });
    }
};

module.exports = Service;