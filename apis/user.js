/**
 * Created by Ahmed on 7/21/2016.
 */
var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

router.get('/', function(req, res, next) {
    var service = new Service();
    service.getUser(req.query.id,
        function(user)
        {
            if(user!=null)
                res.send(user);
            else
                res.status(404).end();
        },
        function()
        {
            res.status(500).end();
        }
    )
});

module.exports = router;