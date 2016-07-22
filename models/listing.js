/**
 * Created by Ahmed on 7/21/2016.
 */

module.exports = {
    findByUser:function (user,client,callback) {
        client.query('SELECT * FROM listings WHERE created_by=$1::int',[user.id], function(err, result) {
            if(err)
                callback(null,err);
            else if (result.rowCount ==0)
                callback([]);
            else
                callback(result.rows);
        });
    },
    findByApplication:function (application,client,callback) {
        client.query('SELECT l.* FROM listings l INNER JOIN applications a ON a.listing_id = l.id' +
        ' WHERE a.id=$1::int',[application.id], function(err, result) {
            if(err)
                callback(null,err);
            else if (result.rowCount ==0)
                callback([]);
            else
                callback(result.rows);
        });
    }
};