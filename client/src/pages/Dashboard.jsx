import { useEffect, useState } from 'react';
import { useFileExplorer } from '@/contexts/FileExplorerContext';
import Navbar from '@/components/common/Navbar';
import FolderTree from '@/components/app/FolderTree';
import ImageList from '@/components/app/ImageList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CreateFolder from '@/components/app/CreateFolder';
import UploadImage from '@/components/app/UploadImage';
import axios from 'axios';

export default function Dashboard() {
  const {
    folders,
    images,
    selectedFolder,
    loading,
    fetchData,
    setImages
  } = useFileExplorer();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/images/search?query=${encodeURIComponent(searchQuery)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImages(response.data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const filteredImages = selectedFolder
    ? images.filter(img =>
      (img.folder?._id === selectedFolder || img.folder === selectedFolder)
    )
    : images;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 gap-6 flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm p-5 h-[calc(100vh-8rem)] flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">File Explorer</h2>
            <FolderTree />
          </div>
        </div>

        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm p-5 h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedFolder
                    ? folders.find(f => f._id === selectedFolder)?.name || 'Selected Images'
                    : 'All Images'}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({filteredImages.length} images)
                  </span>
                </h2>
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white shadow-sm"
                  disabled={loading}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 border-gray-300 hover:bg-gray-100"
                  onClick={handleSearch}
                  disabled={loading || !searchQuery.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </Button>
                <CreateFolder />
                <UploadImage onImageUploaded={fetchData} />
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Loading images...</p>
                  </div>
                </div>
              ) : (
                <ImageList images={filteredImages} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
