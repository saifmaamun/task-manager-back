import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    status: { type: String, enum: ['To Do', 'On Progress', 'Done', 'Timeout'], default: 'To Do' },
    deadline: { type: Date, required: true },
}, { timestamps: true });

export default model('Task', taskSchema);
