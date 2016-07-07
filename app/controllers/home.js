var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Song = mongoose.model('Song'),
  ms = require('mediaserver');

var needle = require('needle');

var path = require('path');
var config = require("../../config/config.js");

var fs = require('fs');
var youtubedl = require('youtube-dl');
var ffmpeg = require('fluent-ffmpeg');


module.exports = function(app) {
  app.use('/', router);
};

router.get('/', function(req, res, next) {
  Song.find(function(err, songs) {
    if (err) return next(err);
    res.render('index', {
      title: 'Youtube MP3 Player',
      songs: songs
    });
  });
});


router.get('/download/:id', function(req, res) {
  Song.findOne({
    youtube_id: req.params.id
  }, function(err, song) {
    if (err) {
      console.log(err);
    }
    if (song) {
      res.send("Song Already Exists");
    }
    else {
      var video = youtubedl('https://www.youtube.com/watch?v=' + req.params.id, ['--format=18'], {
        cwd: __dirname
      });

      video.on('info', function(info) {
        var newSong = new Song({
          title: info.title,
          thumbnail_url: info.thumbnails[0].url,
          youtube_id: req.params.id
        });

        newSong.save(function(err, song) {
          if (err)
            console.log(err);
          res.json(song);
        })
      });

      var proc = new ffmpeg({
        source: video
      })

      var mp3 = './audio_files/' + req.params.id + '.mp3'

      proc.saveToFile(mp3, function(stdout, stderr) {
        if (stderr)
          console.log(stderr);
      });
    }
  })
});

router.get('/audio/:id', function(req, res) {
  ms.pipe(req, res, path.join(__dirname, '../../audio_files/', req.params.id + '.mp3'));
});


router.get('/search/:search_term', function(req, res) {
    needle.get('https://www.googleapis.com/youtube/v3/search?part=id%2Csnippet&q=' + req.params.search_term + '&type=video&key=' + config.apikey, function(error, response) {
            if (!error && response.statusCode == 200) {
              res.render('search',{
                songs : response.body.items
              });
            }
    });
})
