var express = require('express');
var router = express.Router();

var mysqlDB = require('../mysql');
// mysqlDB.connect();

router.get('/', function(req, res, next) {
    let id = req.query.id;
    console.log(id)
    let query = "select ex_name, ex_text from ex_list where ex_id=" + id;
    mysqlDB.query(query, function(err, rows, fields) {
        if (!err) {
            console.log(rows);

            result = JSON.stringify(rows);

            res.send(result);
        } else {
            console.log('query error : ' + err);
            res.send(err);
        }
    });
});





module.exports = router;
