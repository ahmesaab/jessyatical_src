var pool = require('./db.js');
var User = require('./dao/user.js');
var Listing = require('./dao/listing.js');
var Application = require('./dao/application.js');

var pageSize = 3;

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
    },
    getTopActiveUsers:function(page,callback) {
        pool.connect(function (err, client, done) {
            if (err)
                callback(null, err);
            else if (typeof(page) != "boolean" && !isNaN(page) && page.indexOf('.')==-1)
            {
                client.query('SELECT u.*, COUNT(a.id) as count FROM applications a RIGHT JOIN users u' +
                ' ON u.id = a.user_id GROUP BY u.id,a.id ORDER BY count DESC OFFSET '+(page-1)*(pageSize)+
                ' ROWS FETCH NEXT '+ pageSize +' ROWS ONLY', function(err, result)
                {
                    if(err)
                    {
                        console.log(err);
                        callback(null,err);
                    }
                    else
                        callback(result.rows);
                });
            }
            else
            {
                callback(null,"page is not a number");
            }
        });
    }
};

module.exports = Service;