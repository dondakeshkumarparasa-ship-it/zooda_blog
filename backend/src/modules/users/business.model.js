const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true
    },
    businessName: { 
        type: String, 
        required: true, 
        trim: true, 
        maxlength: 100,
        unique: true
    },
    businessCategory: {
        type: String,
        required: true,
    },
    businessDescription: { 
        type: String, 
        required: true, 
        maxlength: 500 
    },
    businessWebsite: { 
        type: String, 
        default: null,
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/i.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    businessAddress: { 
        type: String, 
        required: true, 
        maxlength: 200 
    },
    businessPhone: { 
        type: String, 
        required: true,
        trim: true
    },
    logoUrl: { 
        type: String, 
        default: null 
    },
    status: { 
        type: String, 
        enum: ['pending', 'active', 'inactive', 'suspended'], 
        default: 'pending'
    },
    verified: { 
        type: Boolean, 
        default: false 
    },
    rejectionReason: {
        type: String,
        default: null
    },
    suspensionReason: {
        type: String,
        default: null
    },
    followers: { 
        type: Number, 
        default: 1
    },
    followersList: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Client' 
    }],
    totalPosts: { 
        type: Number, 
        default: 0 
    },
    totalProducts: { 
        type: Number, 
        default: 0 
    },
    engagementRate: { 
        type: Number, 
        default: 0 
    },
    botId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bot',
        default: null
    },
    apiKey: {
        type: String,
        unique: true,
        sparse: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.models.Business || mongoose.model('Business', businessSchema);
