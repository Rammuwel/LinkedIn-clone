import uploadOnCloudinary from "../config/cloudinary.js";
import { io } from "../index.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";


export const createPost = async (req, res) => {

  try {
    let { description } = req.body;
    let newPost

    if (req.file) {

      let image = await uploadOnCloudinary(req.file.path)

      newPost = await Post.create({
        author: req.userId,
        description,
        image

      })
    } else {

      newPost = await Post.create({
        author: req.userId,
        description


      })
    }

    return res.status(201).json({ success: true, newPost })

  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}


export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "firstName lastName profileImage headline")
      .populate("comment.user", "firstName lastName profileImage headline")


    if (!posts) {
      return res.json({ success: false, message: "Posts Not Faund" })

    }

    return res.status(200).json({ success: true, posts })


  } catch (error) {
    return res.json({ success: false, message: error.message })

  }
}


export const like = async (req, res) => {
  try {
    const postId = req.params.id
    const userId = req.userId

    let post = await Post.findById(postId)

    if (!post) {
      return res.json({ success: false, message: "Post Not Faund" })
    }
    if (post.like.includes(userId)) {
      post.like = post.like.filter((id) => id != userId)
    } else {
      post.like.push(userId)
      if(post.author._id !== userId){
        let notification = await Notification.create({
          receiver: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId
        })
      }
    }

    post.save()

    io.emit("likeUpdated", { postId, likes: post.like })
    return res.status(200).json({ success: true, like: post.like })


  } catch (error) {
    return res.json({ success: false, message: error.message })

  }
}


export const comment = async (req, res) => {

  try {
    const postId = req.params.id
    const userId = req.userId
    const { content } = req.body

    let post = await Post.findByIdAndUpdate(postId,
      {
        $push: {
          comment: {
            content,
            user: userId,
            createdAt: new Date()
          }
        }
      }, { new: true }).populate("comment.user", "firstName lastName profileImage headline")

    if (post.author._id !== userId) {
      let notification = await Notification.create({
        receiver: post.author,
        type: "comment",
        relatedUser: userId,
        relatedPost: postId
      })
    }

    io.emit("commentUpdated", { postId, comment: post.comment })
    return res.status(200).json({ success: true, comment: post.comment })

  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}