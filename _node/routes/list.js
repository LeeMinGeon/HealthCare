var express = require('express');
var router = express.Router();

var mysqlDB = require('../mysql');
// mysqlDB.connect();

router.get('/', function(req, res, next) {
  mysqlDB.query('select * from health_list', function(err, rows, fields) {
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


router.get('/items', function(req, res, next) {
  console.log(req.query)

  let query = 'select * from ex_list where ex_healthindex=' + req.query.id;
  console.log(query);
  mysqlDB.query(query, function(err, rows, fields) {
    if (!err) {
      console.log(rows);
      let result = JSON.stringify(rows);
      console.log(result);
      res.send(result);
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }

  });

});


router.get('/growup', function(req, res, next) {
  console.log(req.query)

  let query = 'select ex_id, ex_name from ex_list as A, growup_able as B where A.ex_id = B.id_growup';
  console.log(query);
  mysqlDB.query(query, function(err, rows, fields) {
    if (!err) {
      console.log(rows);
      let result = JSON.stringify(rows);
      console.log(result);
      res.send(result);
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }

  });

});


module.exports = router;
