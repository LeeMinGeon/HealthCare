var express = require('express');
var router = express.Router();

let jwt = require("jsonwebtoken");
let secretKey = require("../config/jwt");

var mysqlDB = require('../mysql');
mysqlDB.connect();



/* GET users listing. */
router.get('/Login', function(req, res, next) {
  console.log(req);
  console.log(secretKey + " <<<<<<")
  res.send('respond with a resource');
});


/* post login */
router.post('/Login', function(req, res, next) {
  mysqlDB.query("select user_id, user_nickname from health_User where user_id='" + req.body.test + "' and user_password='" + req.body.testpw + "' ",
    function(err, rows, fields) {
      if (!err) {
        console.log(rows[0])
        if (rows[0] != undefined) {

          let token = jwt.sign({
              id: rows[0].user_id,
              nickname: rows[0].user_nickname,
            },
            secretKey, {
              expiresIn: '1y'
            });

          let item = {};
          item.user_id = rows[0].user_id;
          item.user_nickname = rows[0].user_nickname;
          item.token = token;
          console.log(item);
          res.send(item);
        } else {
          res.send("x");
        }
      }
    });

});

/* post Token */
router.post('/Verify', function(req, res, next) {
  let token = req.body.token;
  let declare = jwt.verify(token, secretKey, (err, result) => {
    return result
  });

  console.log(token);

  if (declare) {
    console.log(declare);

    res.send(declare);
  } else {
    res.send('Fail');
  };
});


/* post ID Check */
router.post('/IdCheck', function(req, res, next) {

  mysqlDB.query("select user_id from health_User where user_id=" + req.body.id,
    function(err, rows, fields) {
      if (!err) {
        if (rows[0] != undefined) {
          res.send(true);
        } else {
          res.send(false);
        }
      }
    });
});


/* post Regist */
router.post('/Regist', function(req, res, error) {
  if (req.body.regist == "1") {

    let query = "insert into health_User(user_id, user_password, user_age, user_sex, user_height, user_weight, user_bmi, user_nickname, user_date) values('" + req.body.user_id + "','" + req.body.user_password + "'," + req.body.user_age + "," + req.body.user_sex + "," + req.body.user_height + "," + req.body.user_weight + "," + req.body.user_bmi + ",'" + req.body.user_nickname + "','" + req.body.user_date + "')";
    console.log(query);

    mysqlDB.query(query, function(err, rows, fields) {

      console.log(query);
      if (rows.insertId) {
        console.log(rows);

        let token = jwt.sign({
            id: req.body.user_id,
            nickname: req.body.user_nickname,
          },
          secretKey, {
            expiresIn: '1y'
          });
        let item = {};
        item.user_id = req.body.user_id;
        item.user_nickname = req.body.user_nickname;
        item.token = token;
        console.log(item);
        res.send(item);
      } else {
        console.log("err");
        res.send('');
      }
    });


  } else {
    let query = "select user_id from health_User where user_id='" + req.body.user_id + "'";

    mysqlDB.query(query, function(err, rows, fields) {
      if (!err) {
        if (rows[0] == undefined) {
          res.send("0");
        } else {
          console.log(rows[0]);
          res.send("1");
        }
      }

    });

  }

});

router.post('/Pushpull', function(req, res, next) {

  let jo = JSON.parse(req.body.data);


  let query = 'insert into pushpull_elapsedtime(pushpull_user_id, pushpull_type, _2, _4, _6, _8, _10, _12, _14, _16, _18, _20, _22, _24, _26, _28, _30, _32, _34, _36, _38, _40, _42, _44, _46, _48, _50, _52, _54, _56, _58, _60) values ("' + jo.id + '", ' + jo.type ;

  // for(let i=0; i<jo.data.legnth; i++)
  // {
  //   let obj = JSON.stringify(jo.data[i]);
  //   let j = JSON.parse(obj);
  //   query += ", " + j.value;
  // }
  for(let obj of jo.data)
  {
    if(obj.value != "")
    {
      query = query + ", " + obj.value.replace("\r", " ").split('-')[1];
    }
    else
    {
      console.log("null");
      query = query + ", " + 0 ;
    }

  }
  query += ")";

  console.log(query);

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
/*
router.post('/Pushpull', function(req, res, next) {
    console.log(req.body);
    res.send('Ok');
});



router.post('/Pushpull', function(req, res, next) {
 let query = 'insert into pushpull_elapsedtime(pushpull_user_id, pushpull_type, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60) values ("' + req.user_id + '", "' + req.pushpull_type + '", ';

    let jo = JSON.parse(req.body.data);

    console.log(jo.id);
    res.send('Ok');
});
*/

/* post User information Update
router.post('/Update', function(req, res, error) {
  if (req.body.update == "1") {
    let token = req.body.token;
    let declare = jwt.verify(token, secretKey, (err, result) => {
      return result
    });
    if (declare) {
      console.log(declare);
      let query = "update health_User set (user_age = " + req.body.user_age + ", user_sex = " + req.body.user_sex + ", user_height = " + req.body.user_height + ", user_weight = " + req.body.user_weight + ", user_nickname='" + req.body.user_nickname + "') where ";
      console.log(query);

      mysqlDB.query(query,
        function(err, rows, fields) {
          if (!err) {
            console.log(query)
            if (rows.insertId) {
              console.log(rows);
              res.send("ok");
            } else {

            }

          } else {
            console.log("fail");
          }
        });
      res.send(declare);

    } else {
      res.send('Fail');
    }

  } else {

  }

});
*/


module.exports = router;
