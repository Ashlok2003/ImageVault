/* eslint-disable react-refresh/only-export-components */
"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

const FileExplorerContext = createContext();

export function FileExplorerProvider({ children }) {
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view folders and images");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [folderResponse, imageResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/folders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/images`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setFolders(folderResponse.data || []);
      setImages(imageResponse.data.map(image => ({
        ...image,
        folder: image.folder?._id ? { _id: image.folder._id } : null,
      })) || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(
        err.response?.data?.message ||
        "Failed to fetch data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const addFolder = useCallback((newFolder) => {
    setFolders(prev => [...prev, newFolder]);
  }, []);

  const updateFolder = useCallback((folderId, name) => {
    setFolders(prev =>
      prev.map(folder =>
        folder._id === folderId ? { ...folder, name } : folder
      )
    );
  }, []);

  const addImage = useCallback((newImage) => {
    const normalizedImage = {
      ...newImage,
      folder: newImage.folder?._id ? { _id: newImage.folder._id } : null,
    };
    setImages(prev => [...prev, normalizedImage]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <FileExplorerContext.Provider
      value={{
        folders,
        images,
        setImages,
        error,
        loading,
        selectedFolder,
        setSelectedFolder,
        fetchData,
        addFolder,
        updateFolder,
        addImage,
      }}
    >
      {children}
    </FileExplorerContext.Provider>
  );
}

export function useFileExplorer() {
  const context = useContext(FileExplorerContext);
  if (context === undefined) {
    throw new Error("useFileExplorer must be used within a FileExplorerProvider");
  }
  return context;
}
