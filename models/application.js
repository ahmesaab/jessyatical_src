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
                    if (applications[results[i].a_id] == null) {
                        applications.push({
                            id: results[i].a_id, created_at: results[i].a_created_at
                            , cover_letter: results[i].a_cover_letter, listings: []
                        });
                    }
                    applications[results[i].a_id].listings.push("dede");
                }
                callback(applications);
            }

        });
    }
};