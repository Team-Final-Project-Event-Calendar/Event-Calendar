import mongoose from 'mongoose';

const recurrenceSchema = new mongoose.Schema({
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    interval: {
        type: Number,
        default: 1
    },
    endDate: {
        type: Date
    }
}, { _id: false });


const eventSeriesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startingEventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    // Ending event (optional - can run  indefinitely)
    endingEventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    isIndefinite: {
        type: Boolean,
        default: false
    },
    seriesType: {
        type: String,
        enum: ['recurring', 'manual'],
        required: true,
        default: 'recurring'
    },
    //reccurence (automatic scheduling)
    recurrenceRule: {
        type: recurrenceSchema,
        required: function () {
            return this.seriesType === 'recurring';
        }
    },
    // For manual series
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
