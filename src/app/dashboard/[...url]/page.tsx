"use client";
import React from 'react';
import Image from "next/image";
import Link from 'next/link';

interface ImagePageProps {
  params: {
    url: string[]; // 'url' will be an array because it's a catch-all route
  };
}

export default function ImagePage({ params }: ImagePageProps) {
  // Join the segments of the URL array into a single string
  const url = params.url ? params.url.join('/') : '';
  console.log(url);
  return (
    <div className="flex flex-col items-center justify-center h-[100vh] bg-gradient-to-r from-indigo-300 to-blue-500 p-8">
      <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
        Image Preview
      </h1>
      {url ? (
        <div className="relative w-full max-w-3xl mb-4 shadow-xl rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105">
          <Image 
            src={decodeURIComponent(url)} 
            alt="Image to display" 
            width={600} 
            height={450} 
            className="rounded-lg transition duration-300 ease-in-out transform hover:scale-110 object-contain"
          />
        </div>
      ) : (
        <p className="text-red-300 text-lg">No image available.</p>
      )}
      <Link href={`/dashboard`} className="mt-4 bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-800 transition duration-300">
        Back to Dashboard
      </Link>
      <div className="mt-6 text-gray-200 text-center">
        <p className="text-sm">Click the image for a larger view!</p>
      </div>
    </div>
  );
}
