var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var youtubedl = require('youtube-dl');

module.exports = function() { 
    var video = youtubedl('http://www.youtube.com/watch?v=90AiXO1pAiA',
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname });
   
  // Will be called when the download starts.
  video.on('info', function(info) {
    console.log('Download started');
    console.log('filename: ' + info.filename);
    console.log('size: ' + info.size);
  });
   
  video.pipe(fs.createWriteStream('myvideo.mp4'));
}