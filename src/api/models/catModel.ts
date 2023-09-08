// TODO: mongoose schema for cat
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export const catSchema = new Schema({
  cat_name: {
    type: String,
  },
  weight: {
    type: Number,
  },
  filename: {
    type: String,
  },
  birthdate: {
    type: String,
  },
  location: {
    type: {
      type: String,
    },
    lat: {
      type: Number,
    },
    long: {
      type: Number,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const cat = mongoose.model('Cat', catSchema);
module.exports = cat;
export default cat;
