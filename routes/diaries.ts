import express from 'express'

import Diary from '../models/diaryentry'

import { DiaryEntryType } from '../types'

import { Response } from 'express'

import toNewDiary from '../utils/parsing'

import jwt from 'jsonwebtoken'

const User = require('../models/user')

const diariesRouter = express.Router()

diariesRouter.get('/', async (req: any, res: Response) => {
    try {
        const token = req.token
        const decodedToken = <any>jwt.verify(token, process.env.SECRET!) // typecast as any in order to access token properties 
        const user = await User.findById(decodedToken.id)
        if (!token || !decodedToken.id || !user) {    
            return res.status(401).json({ 
                error: 'token missing or invalid' // make sure user is logged in before giving access to diary list
            })  
        }
        const diaries: DiaryEntryType[] = await Diary.find({ priv: false }).populate('user', 'username') // only give users access to public diaries
        return res.send(diaries)
    } catch(e) {
        return res.status(404).json({ error: "must be logged in to access diaries"})
    }

})
diariesRouter.get('/currentUserDiaries', async (req: any, res: Response) => { // route to give user all their diaries
    try {
      const token = req.token
      const decodedToken = <any>jwt.verify(token, process.env.SECRET!)
      const user = await User.findById(decodedToken.id)
      if (!user) {
          return res.status(400).json("you must be logged in for this operation")
      }
      const allDiaries = await Diary.find({}).populate('user', 'username') // mongoose cant query by reference fields, so all diaries are grabbed and filtered with javascript's built in filter
      const userDiaries = allDiaries.filter((d: { user: any }) => d.user.id.toString() === user._id.toString())
      return res.json(userDiaries)
    } catch(e) {
      return res.status(400).json({error : e })
    }
  
  })
diariesRouter.get('/:id', async (req: any, res: Response) => {
    try {
        const id = req.params.id
        const token = req.token
        const decodedToken = <any>jwt.verify(token, process.env.SECRET!)
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return res.status(400).json("you must be logged in for this operation")
        }
        const diary: (DiaryEntryType | null) = await Diary.findById(id).populate('user', 'username')
        if (!diary) {
            return res.status(404).json("diary not found") // this check is unnecessary due to the way await works with a try/catch block, it's here to satisfy typescripts compiler
        }
        if (diary.priv == false) {
            return res.json(diary) // if diary isn't private, it's accessible by any user. otherwise only accessible by user who created it
        }
        if (diary.user.toString() !== user._id.toString()) {
            return res.status(404).json({error: "This diary is private and can only be viewed by the user who made it."})
        }
        return res.status(200).json(diary)
    } catch(e) {
        return res.status(400).json(`error: ${e}`)
    }
})

diariesRouter.post('/', async (req: any, res: Response) => { // route to create a new diary with a post request
    try {
        const body = req.body
        const token = req.token
    
        const decodedToken = <any>jwt.verify(token, process.env.SECRET!) 
        
        if (!token || !decodedToken.id) {    
            return res.status(401).json({ 
                error: 'token missing or invalid' 
            })  
        }
    
        const user: any = await User.findById(decodedToken.id)
        const newDiary = new Diary({
            ...toNewDiary(body), // parse data sent in post request
            user: user._id,
            date: new Date()
        })
        const addedDiary = await newDiary.save()
        user.diaryentries = user.diaryentries.concat(addedDiary._id)
        await user.save()
        return res.status(201).json(addedDiary)
    } catch(e) {
        return res.status(400).json({ error: `${e}`})
    }
})

diariesRouter.delete('/:id', async (req: any, res: Response) => { // route to delete diaries
    try {
        const id = req.params.id
        const token = req.token
        const decodedToken = <any>jwt.verify(token, process.env.SECRET!) 
        if (!token || !decodedToken.id) {    
            return res.status(401).json({ 
                error: 'token missing or invalid' 
            })  
        }
        const diaryToDelete: (DiaryEntryType | null) = await Diary.findById(id)
        if (!diaryToDelete) {
            return res.status(404).json("diary not found") 
        }
        const user: any = await User.findById(decodedToken.id)
        if (diaryToDelete.user.toString() !== user._id.toString()) { // make sure current user is the user who created the diary they're trying to delete
            return res.status(400).json({error: "Only the user who created this diary can delete it."})
        }
        user.diaryentries = user.diaryentries.filter((diary: any)=> diary.user !== diaryToDelete.user) // filter out diary
        await user.save()
        await Diary.findByIdAndRemove(id)
        return res.status(204).end()
    } catch(e) {
        return res.status(400).json({error: e})
    }

})

diariesRouter.put('/:id', async (req: any, res: Response) => { // route to edit diaries
    try {
        const body = req.body
        const id = req.params.id
        const token = req.token
        const decodedToken = <any>jwt.verify(token, process.env.SECRET!) 
        if (!token || !decodedToken.id) {    
            return res.status(401).json({ 
                error: 'token missing or invalid' 
            })  
        }
        const diaryToUpdate: (DiaryEntryType | null) = await Diary.findById(id)
        if (!diaryToUpdate) {
            return res.status(404).json("diary not found") 
        }
        const user: any = await User.findById(decodedToken.id)
        if (diaryToUpdate.user.toString() !== user._id.toString()) { // make sure user is the user who created the edited diary
            return res.status(400).json({error: "Only the user who created this diary can edit it."})
        }
        if (!body.hasOwnProperty('text') && !body.hasOwnProperty('priv')) return res.status(400).json("no edited properties sent") // can only edit the test/priv fields of a diary

        if (body.hasOwnProperty('text')) {
            await Diary.updateOne({ _id: id }, { // update text of users diary
                text: body.text
            })
        }

        if (body.hasOwnProperty('priv')) {
            await Diary.updateOne({ _id: id }, { // update privacy setting of users diary
                priv: body.priv
            })
        }
        const updatedDiary = await Diary.findById(id)
        return res.json(updatedDiary)
    } catch(e) {
        return res.status(400).json({error: e})
    }
})

export default diariesRouter