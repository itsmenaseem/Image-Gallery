"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

export default function Page({ params }: { params: { token: string } }) {
  const [images, setImages] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  const itemsPerPage = 10;
  const router = useRouter();

  async function getImages() {
    setLoading(true);
    try {
      const response = await axios.get('/api/dashboard');
      setImages(response.data.images);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
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

  const toggleFavorite = (image: string) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(image)) {
        return prevFavorites.filter((fav) => fav !== image);
      } else {
        return [...prevFavorites, image];
      }
    });
  };

  return (
    <div className="flex flex-col dash bg-white min-h-screen">
      <Navbar />
      
      <div className="p-6 mt-4 pt-20">
        <div className="flex justify-end mb-4">
          <button 
            className={`px-4 py-2 text-white rounded ${!showFavorites ? 'bg-blue-600' : 'bg-gray-400'}`} 
            onClick={() => { setShowFavorites(false); setError(null); }}
          >
            All Images
          </button>
          <button 
            className={`ml-2 px-4 py-2 text-white rounded ${showFavorites ? 'bg-blue-600' : 'bg-gray-400'}`} 
            onClick={() => { setShowFavorites(true); setError(null); }}
          >
            Favorites
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg font-semibold text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">{showFavorites ? 'Favorites' : 'All Images'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(showFavorites ? favorites : images.slice(0, currentIndex + itemsPerPage)).map((image, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105">
                  <img
                    src={image}
                    alt={`Image ${index}`}
                    className="w-full h-full object-cover rounded-lg shadow-md border-2 border-white"
                    onClick={() => handleImageClick(image)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out rounded-lg">
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <p className="text-lg font-bold">View Image {index + 1}</p>
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(image); }}>
                        {favorites.includes(image) ? (
                          <AiFillHeart className="text-red-500 text-2xl" />
                        ) : (
                          <AiOutlineHeart className="text-white text-2xl" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {loadMoreVisible && (
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
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-screen rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
