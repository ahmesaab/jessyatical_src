/**
 * Created by Ahmed on 7/21/2016.
 */

var Utils = require('../utils.js');

module.exports = {
    findByUser:function (user,client,callback) {
        client.query('SELECT a.id as a_id,a.created_at as a_created_at, a.cover_letter as a_cover_letter,'+
            'l.id as l_id, l.created_at as l_created_at, l.name as l_name, l.description as l_description'+
            ' FROM applications a INNER JOIN listings l ON l.id = a.listing_id WHERE user_id=$1::int ' +
            'ORDER BY a.created_at DESC LIMIT 5'
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
    findTopAppliedListingNamesByUsers:function (userIds,client,callback) {
        var date = Utils.dateBySubtractingDays(new Date(),7);
        client.query('SELECT a.user_id,l.name FROM applications a INNER JOIN listings l ON a.listing_id = l.id ' +
            'WHERE a.user_id IN ('+userIds.toString()+') AND a.created_at > $1::timestamp ORDER BY' +
            ' a.user_id,a.created_at;',[date],function(err, result) {
                if(err)
                    console.log(err);
                    //callback(null,err);
                else if (result.rowCount ==0)
                    callback([]);
                else
                    callback(result.rows);
            });
    }
};