"use client"
import Image from "next/image";
import bgImage from "../../public/assets/bgImage.jpg"; // Adjust the path if necessary
import Form from "@/components/Form";
import './globals.css'
export default function Home() {
  return (
    <div
    className="BgImage"
  >   
      <div>
        <Form />
      </div>
    </div>
  );
}
