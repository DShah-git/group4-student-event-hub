const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  dateTime: {
    type: Date,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  creator: {
    type: String,
    required: true
  },

  registeredStudents: {
    type: [Object],
    required: true
  },

  volunteerStudents:{
    type: [Object],
    required: true
  },

  tasks:{
    type: [Object],
    required: true
  },


}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
