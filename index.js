//****************************************************************************//
//**************** Created By:  Shubham Kumar Gupta *************************//
//**************************************************************************//
const sync=require('sync');
const youtubedl = require('youtube-dl');
const ejs=require('ejs');
const fs=require('fs');
const path = require('path')  
const request = require('request') 
const http = require('https')  
const Axios = require('axios');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.set('port', (process.env.PORT || 3000));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static(__dirname + '/public'));


//*******************************************************************************************//

function down (uri){
var video = youtubedl(uri, [],{ cwd: __dirname });
video.on('info', function(info) {
  
  console.log('Download started');
  console.log('filename: ' + info._filename);
  console.log('size: ' + info.size);
});

video.pipe(fs.createWriteStream('myvideo1.mp4'));
}

//***********************************************************************************//

async function downloadvideo() {  
  const url = global.uri;
  const Path = path.resolve(__dirname, 'videos', global.vinfo.title+'.mp4')
  const writer = fs.createWriteStream(Path)
  
  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })
  
  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}
//*************************************************************************************//

//************************************************************************************//

 function  getinfo(){
  var url = global.inputContent;
  youtubedl.getInfo(url, function(err, info) {
  if (err) throw err;
  global.vinfo=info;
  console.log(global.vinfo);
  });
}

//******************************************************************************//

app.get('/', function(req, res){
res.render('index.html');
});

app.get('/about', function(req, res){
res.render('about.html');
});



app.post('/fetch', function(req,res){
  global.inputContent = req.body.textField;
  getinfo();
  res.render('down.ejs');
 });

 app.get('/load', function(req,res){
  res.render('loader.ejs',{ID:global.vinfo.id,title:global.vinfo.title,url:global.vinfo.url,thumb: global.vinfo.thumbnail, des: global.vinfo.description, filename:global.vinfo._filename,format:global.vinfo._format,formatID:global.vinfo.format_id,size:global.vinfo.filesize,duration:global.vinfo._duration_hms});
  
 });

app.post('/down', function(req, res){
  global.uri=global.vinfo.formats[req.body.choose].url;
   //console.log(global.uri);
  //downloadvideo();
  //download(uri);
  res.render('url.ejs',{uri:global.uri,title:global.vinfo.title});
});

console.log("App running on localhost:",app.get('port'));
app.listen(app.get('port'), function() {
});
