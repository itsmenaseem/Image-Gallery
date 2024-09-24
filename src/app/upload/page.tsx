"use client";
import { useState } from "react";
import "./upload.css"; // Ensure this file has the necessary styles
import { toast } from "react-toastify";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { AiOutlineFileText } from "react-icons/ai"; // Import a pen icon for notes
import axios from "axios";

export default function Form() {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [note, setNote] = useState(""); // State for note
  const router = useRouter();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const formData = new FormData();
    Object.values(files).forEach((file) => {
      formData.append("file", file);
      setFileName(file.name);
    });

    formData.append("notes", note); // Add note to form data
    uploadFiles(formData);
  };

  const uploadFiles = async (formData: FormData) => {
    try {
      setLoading(true); // Set loading to true
       await axios.post("api/upload", formData);

      toast.success("Uploaded successfully");
    } catch (error) {
      router.push("/");
      console.log(error);
      
      toast.error("Failed to upload");
    } finally {
      setLoading(false);
      setFileName("");
      setNote(""); // Clear the note input after upload
    }
  };

  return (
    <div className="upload flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragging ? "border-blue-500 bg-blue-100" : "border-gray-300"} shadow-2xl max-w-md w-full`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <p className="text-gray-700 text-lg font-semibold font-poppins">Drag and drop your files here</p>
        <p className="text-gray-500 mb-4">{fileName || "or click to select files"}</p>
        <input
          type="file"
          name="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleFiles(e.target.files);
            }
          }}
          onClick={(e) => {
            e.currentTarget.value = "";
          }}
        />

        {/* Cool Note Section with Icon */}
        <div className="mt-6 relative">
          <AiOutlineFileText className="absolute left-3 top-3 text-gray-400 text-2xl" />
          <textarea
            className="border-2 border-blue-400 rounded-lg w-full p-4 pl-10 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-600 transition duration-300 ease-in-out bg-white shadow-lg resize-none font-nunito"
            placeholder="Add a cool note (e.g., your thoughts or memory)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            maxLength={200}
          />
          <p className="text-sm text-red-800 mt-1 text-right">
            {note.length}/200 characters
          </p>
        </div>

        <button
          className={`mt-6 bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-transform duration-300 ease-in-out hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => {
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            fileInput?.click();
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="custom-loader"></div> Uploading...
            </>
          ) : "Select Files"}
        </button>
      </div>

      <Link href="/dashboard" className="mt-8 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out shadow-lg font-poppins">
        Back to Dashboard
      </Link>
    </div>
  );
}
