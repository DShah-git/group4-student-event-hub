const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  event_id:{
    type: String,
    required: true
  },
  event_title:{
    type: String,
    required: true
  },
  event_date:{
    type: Date,
    required:true
  },
  posted_date:{
    type: Date,
    required: true
  }
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
