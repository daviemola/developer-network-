const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const user = require('../../models/User')
const profile = require('../../models/Profile')
const post = require('../../models/Post')
const User = require('../../models/User')
const Post = require('../../models/Post')

//@route  POST api/posts
//@desc   create a post
//@access Private
router.post(
  '/',
  [auth, [check('text', 'Text is required')]],
  async (req, res) => {
    const errors = validationResult(res)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select('-password')

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      })

      const post = await newPost.save()
      res.json(post)
    } catch (err) {
      console.error(err)
      res.status(500).send('Server Error')
    }
  },
)

//@route    GET api/posts
//@desc     Get all posts
//@access   Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

//@route    Get api/posts/:id
//@desc     Get post by ID
//@access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: 'page not found' })
    }
    res.json(post)
  } catch (err) {
    console.error(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'page not found' })
    }
    res.status(500).send('Server error')
  }
})

//@route    DELETE api/posts/:id
//@desc     Delete post by ID
//@access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }
    await post.remove()
    res.json({ msg: 'Post removed' })
  } catch (err) {
    console.error(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server error')
  }
})

//@route    PUT api/posts/like/:id
//@desc     Like a post
//@access   Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    //check if post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({
        msg: 'Post already liked',
      })
    }
    post.likes.unshift({ user: req.user.id })
    await post.save()
    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

//@route    PUT api/posts/unlike/:id
//@desc     Unlike a post
//@access   Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    //check if post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({
        msg: 'Post is yet to be liked',
      })
    }
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)
    post.likes.splice(removeIndex, 1)
    await post.save()
    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

//@route  POST api/posts/comments/:id
//@desc   Comment on a post
//@access Private
router.post(
  '/comments/:id',
  [auth, [check('text', 'Text is required')]],
  async (req, res) => {
    const errors = validationResult(res)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select('-password')
      const post = await Post.findById(req.params.id)
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      }

      post.comments.unshift(newComment)
      await post.save()
      res.json(post.comments)
    } catch (err) {
      console.error(err)
      res.status(500).send('Server Error')
    }
  },
)

//@route  DELETE api/posts/comments/:id/:comment_id
//@desc   Delete comment
//@access Private
router.delete('/comments/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    //pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id,
    )
    if (!comment) {
      return res.status(400).json({ msg: 'Comment does not exist' })
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    const removeIndex = post.comments.filter(
      (comm) => comm._id.toString() !== req.params.comment_id,
    )

    post.comments = removeIndex
    await post.save()

    res.json(post.comments)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})
module.exports = router
