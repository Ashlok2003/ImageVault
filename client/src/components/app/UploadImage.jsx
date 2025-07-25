"use client";

import { useState, useRef, useEffect } from "react";
import { useFileExplorer } from "@/contexts/FileExplorerContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { RiseLoader } from "react-spinners";
import axios from "axios";

export default function UploadImage({ onImageUploaded }) {
  const { folders, addImage, selectedFolder } = useFileExplorer();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [parentFolder, setParentFolder] = useState("root");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (open && nameInputRef.current) {
      setTimeout(() => nameInputRef.current.focus(), 100);
    }
    if (open && selectedFolder) {
      setParentFolder(selectedFolder);
    }
  }, [open, selectedFolder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image file");
      return;
    }
    if (!name.trim()) {
      setError("Image name is required");
      return;
    }
    if (name.length > 50) {
      setError("Image name must be 50 characters or less");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file);
      formData.append("name", name.trim());
      if (parentFolder !== "root") {
        formData.append("folder", parentFolder);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/images/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      addImage(response.data);
      setFile(null);
      setName("");
      setParentFolder("root");
      setOpen(false);
      onImageUploaded(); // Trigger data refresh
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setFile(null);
      setName("");
      setParentFolder("root");
      setError("");
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm font-medium shadow-sm transition-colors duration-200">
          Upload Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">Upload Image</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Upload an image, provide a name, and optionally select a folder to organize it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 relative">
          {submitting && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
              <RiseLoader size={8} color="#3b82f6" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="image-name" className="text-sm font-medium text-gray-700">Image Name</Label>
            <Input
              id="image-name"
              placeholder="Enter image name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              ref={nameInputRef}
              required
              disabled={submitting}
              maxLength={50}
              className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
            />
            <p className="text-xs text-gray-500">
              {name.length}/50 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-upload" className="text-sm font-medium text-gray-700">Select Image</Label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={submitting}
              className="block w-full text-sm text-gray-700
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-medium
                file:bg-blue-600 file:text-white
                file:hover:bg-blue-700 file:transition-colors file:duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-folder" className="text-sm font-medium text-gray-700">Folder (Optional)</Label>
            <Select
              value={parentFolder}
              onValueChange={setParentFolder}
              disabled={submitting}
            >
              <SelectTrigger id="image-folder" className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm">
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root" className="text-sm">Root Level</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder._id} value={folder._id} className="text-sm">
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-2 rounded-lg">
              <AlertCircle className="size-4" />
              <p>{error}</p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
              className="h-9 text-sm border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !file || !name.trim()}
              className="h-9 text-sm bg-blue-600 hover:bg-blue-700 text-white"
            >
              Upload
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
