const mongoose = require('mongoose');

// const resumeSchema = new mongoose.Schema({
//         Roll: Number,
//         Image: {
//             filename:{
//                 type: String
//             },
//             contentType:{
//                 type: String
//             },
//             imageBase64: {
//                 type:String
//             },
//         },
//         Details: {},
//         Academics: {},
//         Projects: {},
//         Extra: {}
// });

module.exports = mongoose.model(`resume`, {
    roll: Number,
    Image: {
        filename:{
            type: String
        },
        contentType:{
            type: String
        },
        imageBase64: {
            type:String
        },
    },
    Details: {},
    academics: {},
    projects: {},
    extra: {},
});;