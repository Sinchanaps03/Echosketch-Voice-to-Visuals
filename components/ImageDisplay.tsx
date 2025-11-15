import React, { useEffect, useRef } from 'react';
import { ImageIcon } from './icons/ImageIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageDisplayProps {
  imageUrl: string | null | undefined;
  isLoading: boolean;
  prompt: string | null | undefined;
}

// Loading spinner component
const LoadingSpinner: React.FC<{ prompt: string | null | undefined }> = ({ prompt }) => (
  <div className="flex flex-col items-center justify-center gap-4 text-center">
    <svg className="animate-spin h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-lg font-semibold text-gray-300">Sketching your vision...</p>
    <p className="text-sm text-gray-500 max-w-xs">{prompt}</p>
  </div>
);

// Placeholder when no image is generated
const Placeholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 text-center text-gray-500">
    <ImageIcon className="w-24 h-24" />
    <p className="text-lg text-gray-400">Your generated image will appear here.</p>
  </div>
);


const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, isLoading, prompt }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  // Update image source dynamically when imageUrl changes
  useEffect(() => {
    if (imageUrl && imageRef.current) {
      imageRef.current.src = imageUrl;
      console.log('Image source updated:', imageUrl);
    }
  }, [imageUrl]);

  /**
   * Handles the download functionality for the generated image.
   * Downloads the currently displayed image.
   */
  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `echosketch_image_${Date.now()}.png`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Image download initiated.");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main output container with dashed rounded border */}
      <div className="aspect-square w-full max-w-lg mx-auto bg-gray-800/50 rounded-lg flex items-center justify-center p-4 border-2 border-dashed border-gray-700 relative overflow-hidden">
        {isLoading ? (
          <LoadingSpinner prompt={prompt} />
        ) : imageUrl ? (
          <img
            id="generatedImage"
            ref={imageRef}
            src={imageUrl}
            alt={prompt || 'Generated image'}
            className="max-w-full h-auto object-contain rounded-md transition-opacity duration-500 opacity-0 animate-fade-in"
            style={{ animationFillMode: 'forwards' }}
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              // Show error in container
              if (target.parentElement) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'text-red-400 text-center';
                errorDiv.textContent = 'Failed to load image. Please try again.';
                target.parentElement.appendChild(errorDiv);
              }
            }}
            onLoad={() => console.log('Image loaded successfully:', imageUrl)}
          />
        ) : (
          <Placeholder />
        )}
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
        `}</style>
      </div>
      
      {/* Download button, only visible when an image is successfully loaded */}
      {imageUrl && !isLoading && (
         <button
          onClick={handleDownload}
          title="Download PNG"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200 font-semibold text-sm text-gray-200"
          aria-label="Download generated image"
        >
          <DownloadIcon className="w-5 h-5" />
          Download Image
        </button>
      )}
    </div>
  );
};

export default ImageDisplay;