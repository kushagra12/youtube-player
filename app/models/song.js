var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SongSchema = new Schema({
  title: String,
  thumbnail_url: String,
  youtube_id: String
});

SongSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Song', SongSchema);

