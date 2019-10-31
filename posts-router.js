const router = require('express').Router()
const blogs = require('./data/db')

router.get('/', (req, res) => {
    blogs.find(req.query)
        .then(blog => {
            res.status(200).json(blog)
        })
        .catch(err => {
            console.log(err, 'error from initial get')
            res.status(500).json({error: 'The posts information could not be retrieved.'})
        })
})

router.get('/:id', (req, res)=> {
    blogs.findById(req.params.id)
        .then(blog => {
            if (blog) {
                res.status(200).json(blog)
            }
            else {
                res.status(404).json({response: 'The post with the specified ID does not exist'})
            }
        })
        .catch(err => {
            console.log('error from ID get', err)
            res.status(500).json({error: 'The post information could not be retrieved.'})
        })
})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params
    blogs.findPostComments(id)
        .then(blog => {
            if (blog) {
                res.status(200).json(blog)
            } else {
                res.status(404).json({message: 'The post with the specified ID does not exist'})
            }
        })
        .catch(err => {
            console.log('err from find comments', err)
            res.status(500).json({ error: 'The comments information could not be retrieved.'})
        })
})

router.post('/', (req, res) => {
    const { title, contents } = req.res
    blogs.insert(req.body)
        .then(blog => {
            if (title && contents) {
                res.status(201).json(blog)
            }
            else {
                res.status(400).json({errorMessage: 'Please provide title and contents for the post.'})
            }
        })
        .catch(err => {
            console.log('err from post', err)
            res.status(500).json({error: 'There was an error while saving the post to the database'})
        })
})

router.post('/:id/comments', (req, res) => {
    const comment = req.body
    const {post_id, text} = req.params
    blogs.insertComment(comment)
        .then(blog => {
            if (post_id && text) {
                res.status(201).json(blog)
            } else if (!post_id) {
                res.status(404).json({message: 'The post with the specified ID does not exist'})
            } else if (!text) {
                res.status(400).json({message: 'Please provide text for the comment.'})
            }

        })
        .catch(err => {
            console.log('err from comment post', err)
            res.status(500).json({error: 'There was an error while saving the comment to the database.'})
        })
})

router.delete('/:id', (req, res) => {
    const {id} = req.params
    if (id) {
        blogs.remove(id)
            .then(blog => {
                res.status(200).json(blog)
            })
            .catch(err => {
                res.status(500).json({error: 'The post could not be removed'})
            })
    } else {
        res.status(404).json({response: 'The post with the specified ID does not exist.'})
    }
})

router.put('/:id', (req, res) => {
    const {id} = req.params
    const {title, contents} = req.body
    if (id) {
        blogs.update(req.body)
            .then(blog => {
                if (title && contents) {
                    res.status(201).json(blog)
                }
                else if (!title || !contents) {
                    res.status(400).json({ response: 'Please provide title and contents for the post.'})
                }
            })
            .catch(err => {
                res.status(500).json({ error: 'The post information could not be updated.'})
            })
    } else {
        res.status(404).json({ response: 'The post with the specified ID does not exist.'})
    }
})



module.exports = router