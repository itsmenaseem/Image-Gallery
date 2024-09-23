"use client";
import { useState } from "react";
import "./upload.css"; // Make sure to have the styles in this file
import { toast } from "react-toastify";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import axios from "axios";
export default function Form() {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router=useRouter();
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

    uploadFiles(formData);
  };

  const uploadFiles = async (formData: FormData) => {
    try {
      setLoading(true); // Set loading to true
      const response = await axios.post("api/upload",formData)

      // const result = await response.json();
        toast.success("Uploaded successfully");
      
    } catch (error) {
      router.push("/");
      toast.error("Failed to upload");
    } finally {
      setLoading(false);
      setFileName('');
    }
  };

  return (
    <div className={`upload`}>
      <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragging ? "border-blue-500 bg-blue-100" : "border-gray-300"} shadow-lg`} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
        <p className="text-gray-700 text-lg font-semibold">Drag and drop your files here</p>
        <p className="text-gray-500 mb-4">{fileName || "or click to select files"}</p>
        <input type="file" name="file" className="hidden" onChange={(e) => { if (e.target.files) { handleFiles(e.target.files); } }} onClick={(e) => { e.currentTarget.value = ""; }} />
        <button className={`mt-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => { const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement; fileInput?.click(); }} disabled={loading}>
          {loading ? (<><div className="custom-loader"></div>Uploading...</>) : "Select Files"}
        </button>
      </div>
      <Link href="/dashboard" className="mt-4 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300">
        Back to Dashboard
      </Link>
    </div>
  );
}
