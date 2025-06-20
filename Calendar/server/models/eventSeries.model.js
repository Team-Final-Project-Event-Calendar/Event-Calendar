import mongoose from 'mongoose';

/**
 * Location schema
 * @typedef {Object} Location
 * @property {string} address
 * @property {string} city
 * @property {string} country
 */
const locationSchema = new mongoose.Schema({
    address: String,
    city: String,
    country: String
}, { _id: false });

/**
 * Event time schema for start/end hours
 * @typedef {Object} EventTime
 * @property {number} hour - Hour of the day (0-23)
 * @property {number} minute - Minute of the hour (0-59)
 */
const eventTimeSchema = new mongoose.Schema({
    hour: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    minute: {
        type: Number,
        required: true,
        min: 0,
        max: 59
    }
}, { _id: false });

/**
 * Recurrence rule schema
 * @typedef {Object} RecurrenceRule
 * @property {'daily'|'weekly'|'monthly'|'yearly'} frequency - Recurrence frequency
 * @property {Date} [endDate] - Optional end date of recurrence
 */
const recurrenceSchema = new mongoose.Schema({
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: true
    },
    endDate: {
        type: Date
    }
}, { _id: false });

/**
 * Event template schema for starting/ending events
 * @typedef {Object} EventTemplate
 * @property {string} title - Event title
 * @property {string} description - Event description
 * @property {Date} startDateTime - Starting date and time of the event
 * @property {EventTime} startTime - Start time as hour and minute
 * @property {EventTime} endTime - End time as hour and minute
 * @property {Location} [location] - Optional location information
 */
const eventTemplateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDateTime: {
        type: Date,
        required: true
    },
    startTime: {
        type: eventTimeSchema,
        required: true
    },
    endTime: {
        type: eventTimeSchema,
        required: true
    },
    location: {
        type: locationSchema
    }
}, { _id: false });

/**
 * Main Series of Events schema
 * @typedef {Object} EventSeries
 * @property {string} name - Name of the event series
 * @property {mongoose.Types.ObjectId} creatorId - Reference to User who created the series
 * @property {'recurring'|'manual'} seriesType - Type of series
 * @property {boolean} [isIndefinite=false] - Whether the series has no defined end
 * @property {EventTemplate} startingEvent - Embedded starting event document
 * @property {EventTemplate} [endingEvent] - Embedded ending event document, required if not indefinite
 * @property {RecurrenceRule} [recurrenceRule] - Recurrence rules for recurring series
 * @property {mongoose.Types.ObjectId[]} [eventsId] - Array of references to individual events for manual series
 */
const eventSeriesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seriesType: {
        type: String,
        enum: ['recurring', 'manual'],
        required: true,
        default: 'recurring'
    },
    isIndefinite: {
        type: Boolean,
        default: false
    },
    startingEvent: {
        type: eventTemplateSchema,
        required: true
    },
    endingEvent: {
        type: eventTemplateSchema,
        required: function() {
            return !this.isIndefinite;
        }
    },
    recurrenceRule: {
        type: recurrenceSchema,
        required: function() {
            return this.seriesType === 'recurring';
        }
    },
    eventsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
}, {
    timestamps: true
});

// mongodb performance, to jump directly to creatorId, without going through whole collection
// eventSeriesSchema.index({ creatorId: 1 });

export default mongoose.model('EventSeries', eventSeriesSchema);
