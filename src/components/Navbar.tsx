import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import { FiUpload, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  async function logout() {
    try {
      const response = await axios.get('/api/user/logout');
      console.log(response.data);
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <nav className={`fixed w-full z-10 px-4 md:px-8 py-4 shadow-lg transition-colors duration-500 bg-[#aa47bc] h-[13vh]`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          <Link href="/">
            <h1 className="text-[#0095ff] font-amaranth font-bold text-4xl tracking-tighter transform transition-transform duration-300 ease-in-out hover:scale-125">
              <span>Image</span> <span className='text-pretty text-[#73b036]'>Gallery</span>
            </h1>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`hidden md:flex gap-20 mr-[15vw] mt-2`}>
          <Link href="/upload" className="text-md rounded-lg relative inline-flex items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-2 border-l-2 border-r-2 active:border-red-700 active:shadow-none shadow-lg bg-gradient-to-tr from-red-600 to-red-500 hover:from-red-500 hover:to-red-500 border-red-700 text-white w-full">
            <FiUpload className="mr-1" /> Upload
          </Link>
          <button
            type="button" // Ensure it's not treated as a form submission
            className="text-md rounded-lg relative inline-flex items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-2 border-l-2 border-r-2 active:border-red-700 active:shadow-none shadow-lg bg-gradient-to-tr from-red-600 to-red-500 hover:from-red-500 hover:to-red-500 border-red-700 text-white w-full"
            onClick={logout}
          >
            <FiLogOut className="mr-1" /> Logout
          </button>
        </div>

        {/* Responsive Navigation */}
        <div className={`absolute top-full left-0 w-full bg-[#aa47bc] shadow-lg ${isOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="flex flex-col items-center py-2">
            <Link href="/upload" className="text-md rounded-lg relative inline-flex items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-2 border-l-2 border-r-2 active:border-red-700 active:shadow-none shadow-lg bg-gradient-to-tr from-red-600 to-red-500 hover:from-red-500 hover:to-red-500 border-red-700 text-white w-full text-center">
              <FiUpload className="mr-1" /> Upload
            </Link>
            <button
              type="button" // Ensure it's not treated as a form submission
              className="text-md rounded-lg relative inline-flex items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-2 border-l-2 border-r-2 active:border-red-700 active:shadow-none shadow-lg bg-gradient-to-tr from-red-600 to-red-500 hover:from-red-500 hover:to-red-500 border-red-700 text-white w-full text-center"
              onClick={logout}
            >
              <FiLogOut className="mr-1" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
