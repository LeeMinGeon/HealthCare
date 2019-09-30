var express = require('express');
var router = express.Router();

var mysqlDB = require('../mysql');



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/ex_info', function(req, res, next) {
    res.send()
});

router.get('/extext ', function(req, res, next) {
    mysqlDB.query('select ex_name, ex_text from ex_list', function(err, rows, fields) {
        if (!err) {
            console.log(rows);
            result = JSON.stringify(rows);
            res.send(result);
        } else {
            console.log('query error: ' + err);
            res.send(err);
        }
    });
});


module.exports = router;
