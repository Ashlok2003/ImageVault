import Folder from '../models/folder.js';

export const createFolder = async (req, res) => {
  try {
    const { name, parentFolder } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const folder = new Folder({
      name,
      user: req.user._id,
      parentFolder: parentFolder || null,
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating folder', error: error.message });
  }
};

export const getFolders = async (req, res) => {
  try {

    const folders = await Folder.find({ user: req.user._id })
      .populate({
        path: 'parentFolder',
        select: '_id name',
      })
      .lean();

    console.log('Folders fetched:', folders);

    res.status(200).json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ message: 'Error fetching folders', error: error.message });
  }
};
