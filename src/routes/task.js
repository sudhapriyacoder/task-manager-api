const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();


// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
    const match = {};
    const sort = {};

    if(req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if(req.query.sortBy) {
       const parts = req.query.sortBy.split(':');
       console.log("======================", parts)

       sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
       console.log("======================", sort)

       console.log("======================", sort[parts])
    }

    console.log(sort)

    try {
        // const task = await Task.find({owner: req.user._id});
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(404).send(e)
    }
})

router.get("/tasks/:id", async (req, res) => {
    const _id = req.params.id
    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({_id, owner: req.user._id});
        if (!task) {
            return res.status(404).send('Not found data');
        }
        res.send(task);
    } catch (e) {
        res.status(404).send(e);
    }
});

router.post('/tasks', auth, async (req, res) => {
    const newTask = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await newTask.save();
        res.status(201).send(newTask)
    } catch (e) {
        res.status(400).send(e);
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ["description", "completed"];
    const requestDataKey = Object.keys(req.body);
    isAllowed = requestDataKey.every(data => allowedUpdates.includes(data));
    if (!isAllowed) {
        return res.status(404).send({ "error": "Invalid request body" });
    }
    try {
        const taskToUpdate = await Task.findOne({_id: req.params.id, owner: req.user._id});
        // const taskToUpdate = await Task.findById(req.params.id);
        
        if (!taskToUpdate) {
            res.status(404).send();
        }
        requestDataKey.forEach(task => taskToUpdate[task] = req.body[task]);
        await taskToUpdate.save();
        res.send(taskToUpdate);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!task) {
            res.status(404).send();
        }
        res.send(task)
    } catch (error) {
        res.status(500).send();
    }
})

module.exports = router