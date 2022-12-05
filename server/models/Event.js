const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    title: {
      type: String,
    },
    endTime: {
      type: String,
    },
    daysOfWeek: {
      type: String,
    },
    startRecur: {
      type: String,
    },
    display: {
      type: String,
    },
    backgroundColor: {
      type: String,
    },
    textColor: {
      type: String,
    },
  },
);

const Event = model("Event", eventSchema);

module.exports = Event;