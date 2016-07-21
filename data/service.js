function Service()
{
    // ATTRIBUTE: database connection object from mysql pool.
    this._pool = require('./db.js');
}

// METHOD: query the database by user_id & returns a user model or null if the user doesn't exist.
Service.prototype.getUser = function(id,callback,error)
{
    this._pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM users WHERE id=$1::int',[id], function(err, result) {
            done();
            if(err)
            {
                console.error('error running query', err.message);
                error();
            }
            else if (result.rowCount ==0)
                callback(null);
            else
            {
                console.log(result);
                callback(result.rows[0]);
            }
        });
    });
};

module.exports = Service;