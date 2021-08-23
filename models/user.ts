import { Schema, model } from "mongoose"
import { UserType } from "../types"

const uniqueValidator = require('mongoose-unique-validator')

const schema = new Schema<UserType>({
    username: { type: String, required: true, unique: true, minlength: 3 },
    passwordHash: { type: String, required: true, minlength: 5 },
    diaryentries: [
        {
            type: Schema.Types.ObjectId,
            ref: 'DiaryEntry'
        }
    ]
})

schema.set('toJSON', {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.passwordHash
    },
  })

schema.plugin(uniqueValidator)

const User = model<UserType>('User', schema)

module.exports = User
