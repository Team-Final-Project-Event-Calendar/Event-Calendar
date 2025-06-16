import mongoose from 'mongoose';


// Location schema
const locationSchema = new mongoose.Schema({
    address: String,
    city: String,
    country: String
}, { _id: false });

// Event time schema for start/end hours
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

// Recurrence rule schema
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

// Event template schema for starting/ending events
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


//MAIN Series of Events schema
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
    // Starting event as embedded document instead of reference
    startingEvent: {
        type: eventTemplateSchema,
        required: true
    },
    // Ending event as embedded document (optional if indefinite)
    endingEvent: {
        type: eventTemplateSchema,
        required: function() {
            return !this.isIndefinite;
        }
    },
    // Recurrence rules for recurring series
    recurrenceRule: {
        type: recurrenceSchema,
        required: function() {
            return this.seriesType === 'recurring';
        }
    },
    // For manual series - references to actual events
    eventsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
}, {
    timestamps: true
});


//mongodb performance, to jump directly to creatorId,wihtout going through whole collec.
//eventSeriesSchema.index({ creatorId: 1 });

export default mongoose.model('EventSeries', eventSeriesSchema);
