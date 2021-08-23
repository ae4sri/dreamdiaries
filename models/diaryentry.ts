import { Schema, model } from "mongoose"

import { DiaryEntryType} from "../types"

const schema = new Schema<DiaryEntryType>({
    title: { type: String, required: true, minlength: 5, maxlength: 30 },
    text: { type: String, required: true, minlength: 10, maxlength: 500 },
    date: { type: Date, required: true },
    priv: { type: Boolean, required: true},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
})

schema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
  
const Diary = model<DiaryEntryType>('DiaryEntry', schema)

export default Diary