/**
 * Created by Ahmed on 7/21/2016.
 */

module.exports = {
    findById:function (id,client,callback) {
        client.query('SELECT * FROM users WHERE id=$1::int',[id], function(err, result)
        {
            if(err)
                callback(null,err);
            else if (result.rowCount ==0)
                callback(null,{message:"user not found"});
            else
                callback(result.rows[0]);
        });
    },
    getCompanies:function (id,client,callback) {
        client.query('SELECT c.* FROM companies c INNER JOIN teams t ON t.company_id = c.id ' +
        'WHERE t.user_id=$1::int',[id], function(err, result)
        {
            if(err)
                callback(null,err);
            else if (result.rowCount ==0)
                callback([]);
            else
                callback(result.rows);
        });
    }
};