/**
 * Created by Ahmed on 7/21/2016.
 */

module.exports = {
    findByUser:function (user,client,callback) {
        client.query('SELECT * FROM listings WHERE created_by=$1::int ORDER BY created_at DESC LIMIT 5',
            [user.id], function(err, result) {
            if(err)
                callback(null,err);
            else if (result.rowCount ==0)
                callback([]);
            else
                callback(result.rows);
        });
    }
};