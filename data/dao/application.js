/**
 * Created by Ahmed on 7/21/2016.
 */
module.exports = {
    findByUser:function (user,client,callback) {
        client.query('SELECT a.id as a_id,a.created_at as a_created_at, a.cover_letter as a_cover_letter,'+
            'l.id as l_id, l.created_at as l_created_at, l.name as l_name, l.description as l_description'+
            ' FROM applications a INNER JOIN listings l ON l.id = a.listing_id WHERE user_id=$1::int ORDER BY a.id'
            ,[user.id], function(err, result) {
                if(err)
                    callback(null,err);
                else if (result.rowCount ==0)
                    callback([]);
                else
                {
                    var applications = [];
                    var results = result.rows;
                    for(var i=0;i<results.length;i++) {
                        applications.push({
                            id: results[i].a_id, created_at: results[i].a_created_at,
                            cover_letter: results[i].a_cover_letter, listing: {
                                id: results[i].l_id,
                                name: results[i].l_name, description: results[i].l_description
                            }
                        });
                    }
                    callback(applications);
                }
            });
    },
    findAllUserApplications:function (client,callback) {
        client.query('SELECT u.id as u_id, u.created_at as u_created_at, u.name as u_name, l.name ' +
            'as l_name FROM applications a INNER JOIN listings l ON l.id = a.listing_id INNER JOIN ' +
            'users u ON u.id = a.user_id ORDER BY a.id,a.created_at'
            , function(err, result) {
                if(err)
                    callback(null,err);
                else if (result.rowCount ==0)
                    callback([]);
                else
                {
                    var users = [];
                    var results = result.rows;
                    for(var i=0;i<results.length;i++) {
                        if(users.indexOf(results[i].u_id)==-1){
                            users[results[i].u_id] = {
                                id: results[i].u_id, created_at: results[i].u_created_at,
                                name: results[i].u_name, count:0, listings: []
                            };
                        }
                        users[results[i].u_id].count++;
                    }
                    callback(users);
                }
            });
    }
};