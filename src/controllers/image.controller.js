import { v2 as cloudinary } from 'cloudinary';
import Image from '../models/image.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req, res) => {
  try {
    const { name, folder } = req.body;

    if (!name || !req.file) {
      return res.status(400).json({ message: 'Name and image are required' });
    }

    const image = new Image({
      name,
      url: req.file.path,
      user: req.user._id,
      folder: folder || null,
    });

    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

export const getImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user._id }).populate('folder');
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error: error.message });
  }
};

export const searchImages = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    const images = await Image.find({
      user: req.user._id,
      $or: [
        { name: { $regex: escapedQuery, $options: "i" } },
        { description: { $regex: escapedQuery, $options: "i" } },
      ],
    }).populate("folder");

    console.log("Images: ", images);

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Error searching images", error: error.message });
  }
};
