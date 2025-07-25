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

export default function CreateFolder() {
  const { folders, addFolder } = useFileExplorer();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [parentFolder, setParentFolder] = useState("root");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (open && nameInputRef.current) {
      setTimeout(() => nameInputRef.current.focus(), 100);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Folder name is required");
      return;
    }
    if (name.length > 50) {
      setError("Folder name must be 50 characters or less");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/folders`,
        {
          name: name.trim(),
          parentFolder: parentFolder !== "root" ? parentFolder : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      addFolder(response.data);
      setName("");
      setParentFolder("root");
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create folder");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
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
          Create Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">Create New Folder</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Create a new folder and optionally select a parent folder to organize it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 relative">
          {submitting && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
              <RiseLoader size={8} color="#3b82f6" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="folder-name" className="text-sm font-medium text-gray-700">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="Enter folder name"
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
            <Label htmlFor="parent-folder" className="text-sm font-medium text-gray-700">Parent Folder (Optional)</Label>
            <Select
              value={parentFolder}
              onValueChange={setParentFolder}
              disabled={submitting}
            >
              <SelectTrigger id="parent-folder" className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm">
                <SelectValue placeholder="Select parent folder" />
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
              disabled={submitting || !name.trim()}
              className="h-9 text-sm bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
