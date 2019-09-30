var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var mysqlDB = require('../mysql');

var dir = require('../config/dir');

/* GET home page. */
router.get('/:fileId', function(req, res, next) {
    console.log(">> " + req.params.fileId);
    let fileName = req.params.fileId + ".jpg";
    let savedPath = dir + fileName;
    console.log(savedPath);
    res.download(savedPath);
});



module.exports = router;
