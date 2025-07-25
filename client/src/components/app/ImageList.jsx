import { useState } from 'react';

export default function ImageList({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 mb-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium mb-2">No images found</p>
        <p className="text-xs">Upload images using the button above</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image._id}
          className={`border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${selectedImage === image._id ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-lg hover:-translate-y-1'
            }`}
          onClick={() => setSelectedImage(image._id)}
        >
          <div className="bg-gray-100 border-b aspect-square flex items-center justify-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-lg w-full h-full flex items-center justify-center">
              <img
                src={image.url || '/placeholder-image.png'}
                alt={image.name}
                className="object-cover w-full h-full"
                onError={(e) => e.target.src = '/placeholder-image.png'}
              />
            </div>
          </div>
          <div className="p-3 bg-white">
            <h3 className="font-medium text-sm text-gray-800 truncate">{image.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(image.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
