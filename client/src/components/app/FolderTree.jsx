import { useState, useEffect, useCallback } from "react";
import { useFileExplorer } from "@/contexts/FileExplorerContext";
import { FolderIcon, FolderOpenIcon, ImageIcon, EditIcon, CheckIcon, XIcon } from "lucide-react";
import { HashLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const FolderItem = ({
  folder,
  level = 0,
  onRename,
  onSelect,
  selectedId
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);

  const handleRename = () => {
    onRename(folder._id, newName);
    setIsRenaming(false);
  };

  const handleCancel = () => {
    setNewName(folder.name);
    setIsRenaming(false);
  };

  return (
    <div className="ml-2">
      <div
        className={`flex items-center py-2 px-3 rounded-lg transition-colors duration-200 ${selectedId === folder._id
          ? 'bg-blue-50 text-blue-800 font-medium'
          : 'hover:bg-gray-100 text-gray-700'
          }`}
        style={{ paddingLeft: `${level * 24}px` }}
      >
        <button
          className="mr-2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-150"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <FolderOpenIcon className="text-amber-500 size-5" />
          ) : (
            <FolderIcon className="text-amber-500 size-5" />
          )}
        </button>

        {isRenaming ? (
          <div className="flex items-center flex-1 gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-8 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="size-7 hover:bg-blue-100"
              onClick={handleRename}
            >
              <CheckIcon className="size-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 hover:bg-red-100"
              onClick={handleCancel}
            >
              <XIcon className="size-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center flex-1">
            <span
              className="flex-1 cursor-pointer truncate text-sm font-medium"
              onClick={() => {
                onSelect(folder._id);
                setIsExpanded(true);
              }}
            >
              {folder.name}
            </span>
            <button
              className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-150"
              onClick={() => setIsRenaming(true)}
            >
              <EditIcon className="size-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {isExpanded && folder.children && folder.children.map(child => (
        <FolderItem
          key={child._id}
          folder={child}
          level={level + 1}
          onRename={onRename}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      ))}
    </div>
  );
};

const ImageItem = ({ image, level = 0 }) => {
  return (
    <div
      className="flex items-center py-2 px-3 hover:bg-gray-100 rounded-lg truncate transition-colors duration-200 text-gray-600"
      style={{ paddingLeft: `${level * 24 + 28}px` }}
    >
      <ImageIcon className="text-blue-500 size-5 mr-2" />
      <span className="truncate text-sm">{image.name}</span>
    </div>
  );
};

export default function FolderTree() {
  const {
    folders,
    images,
    error,
    loading,
    selectedFolder,
    setSelectedFolder
  } = useFileExplorer();

  const [treeData, setTreeData] = useState([]);

  const buildTree = useCallback((folders = [], images = []) => {
    const folderMap = {};
    const rootFolders = [];

    folders.forEach(folder => {
      folderMap[folder._id] = {
        ...folder,
        children: []
      };
    });

    folders.forEach(folder => {
      const parentId = folder.parentFolder?._id || folder.parentFolder;
      if (parentId && folderMap[parentId]) {
        folderMap[parentId].children.push(folderMap[folder._id]);
      } else {
        rootFolders.push(folderMap[folder._id]);
      }
    });

    images.forEach(image => {
      const parentId = image.folder?._id || image.folder;
      if (parentId && folderMap[parentId]) {
        folderMap[parentId].children.push({
          ...image,
          isImage: true
        });
      } else {
        rootFolders.push({
          ...image,
          isImage: true
        });
      }
    });

    return rootFolders;
  }, []);

  useEffect(() => {
    if (!loading && (folders.length > 0 || images.length > 0)) {
      setTreeData(buildTree(folders, images));
    }
  }, [folders, images, loading, buildTree]);

  const handleRename = async (folderId, newName) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/folders/${folderId}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Rename error:", err);
    }
  };

  const handleSelectFolder = (folderId) => {
    setSelectedFolder(folderId);
  };

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle className="size-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <HashLoader size={40} color="#3b82f6" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2 font-sans">
      <div className="flex-1 overflow-auto border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
        <div
          className={`p-2 rounded-lg mb-2 cursor-pointer transition-colors duration-200 ${!selectedFolder ? 'bg-blue-50 text-blue-800 font-medium' : 'hover:bg-gray-100 text-gray-700'
            }`}
          onClick={() => handleSelectFolder(null)}
        >
          <div className="flex items-center">
            <FolderOpenIcon className="text-amber-500 size-5 mr-2" />
            <span className="text-sm font-medium">All Folders</span>
          </div>
        </div>

        {treeData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No folders or images found</p>
            <p className="text-xs mt-1">Create a folder or upload images to get started</p>
          </div>
        ) : (
          treeData.map(item =>
            item.isImage ? (
              <ImageItem
                key={`img-${item._id}`}
                image={item}
                level={0}
              />
            ) : (
              <FolderItem
                key={item._id}
                folder={item}
                onRename={handleRename}
                onSelect={handleSelectFolder}
                selectedId={selectedFolder}
              />
            )
          )
        )}
      </div>
    </div>
  );
}
