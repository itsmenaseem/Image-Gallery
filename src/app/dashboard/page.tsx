"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import Image from 'next/image';
import { AiOutlineDownload, AiOutlineDelete, AiOutlineMessage } from 'react-icons/ai';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

interface ImageData{
  _id: string;
  publicId: string;
  imageUrl: string;
  uploadedAt: string;
  date: string;
  notes: string;
}

export default function Page() {
  const [images, setImages] = useState<Array<{ src: string; date: string; notes: string, imageId: string, publicId: string, deleting: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  const itemsPerPage = 10;
  async function getImages() {
    setLoading(true);
    try {
      const response = await axios.get('/api/dashboard');
      console.log(response.data);

      const imagesWithDate = response.data.images.map((imageInfo:ImageData) => ({
        imageId: imageInfo._id,
        publicId: imageInfo.publicId,
        src: imageInfo.imageUrl,
        date: imageInfo.uploadedAt,
        notes: imageInfo.notes || "", // Include notes
        deleting: false // Add a deleting state
      }));  
      setImages(imagesWithDate);

      if (imagesWithDate.length === 0) {
        setLoadMoreVisible(false);
      }
    } catch (error:unknown) {
      console.error('Error fetching images:', error);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteImage(imageId: string, publicId: string) {
    setImages((prevImages) =>
      prevImages.map(image =>
        image.imageId === imageId ? { ...image, deleting: true } : image
      )
    );

    try {
      await axios.post("/api/delete", { imageId, publicId });
      toast.success("Image deleted");
      setImages((prevImages) => prevImages.filter(image => image.imageId !== imageId));
    } catch (error:unknown) {
      console.error('Error deleting image:', error);
      toast.error("Delete image failed");
      setImages((prevImages) =>
        prevImages.map(image =>
          image.imageId === imageId ? { ...image, deleting: false } : image
        )
      );
    }
  }

  useEffect(() => {
    getImages();
  }, []);

  const loadMoreImages = () => {
    const newIndex = currentIndex + itemsPerPage;
    setCurrentIndex(newIndex);
    if (newIndex >= images.length) {
      setLoadMoreVisible(false);
    }
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleDownload = (imageSrc: string) => {
    if (imageSrc) {
      const link = document.createElement('a');
      link.href = imageSrc;
      link.download = imageSrc.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col dash bg-white min-h-screen">
      <Navbar />

      <div className="p-6 mt-4 pt-20">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg font-semibold text-red-600">{error}</p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg font-semibold text-gray-600">No images available.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">All Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.slice(0, currentIndex + itemsPerPage).map((imageObj, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            >
              <Image
                src={imageObj.src}
                alt={`Image ${index}`}
                layout="responsive"
                height={200}
                width={300}
                className="w-full h-full object-cover rounded-lg shadow-md border-2 border-white"
              />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg flex flex-col justify-end">
        <div className="p-4 text-white">
          <p className="text-sm">
            {format(new Date(imageObj.date), 'MMM dd, yyyy, hh:mm:ss a')}
          </p>
          <div className="flex space-x-2 mt-2 items-center">
            <button>
              <AiOutlineMessage className="text-white text-2xl hover:text-blue-800 transition-colors duration-300" />
            </button>
            <p className="text-sm italic">{imageObj.notes}</p>
          </div>
          <div className="flex space-x-2 mt-2">
            <button onClick={() => handleDownload(imageObj.src)}>
              <AiOutlineDownload className="text-white text-2xl" />
            </button>
            <button onClick={() => deleteImage(imageObj.imageId, imageObj.publicId)}>
              {imageObj.deleting ? (
                <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full border-white border-t-transparent"></div>
              ) : (
                <AiOutlineDelete className="text-red-500 text-2xl" />
              )}
            </button>
          </div>
        </div>
        <button
          onClick={() => handleImageClick(imageObj.src)}
          className=" text-white py-2 px-4 rounded mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          View Image
        </button>
      </div>
    </div>
  ))}
</div>


            {loadMoreVisible && images.length > itemsPerPage && (
              <div className="flex justify-center mt-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={loadMoreImages}
                  disabled={loading}
                >
                  Load More Images
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <Image
              src={selectedImage}
              alt="Selected"
               height={400}
               width={400}
              className="max-w-full max-h-screen rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
