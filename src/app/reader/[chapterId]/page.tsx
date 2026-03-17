"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function Reader() {
  const params = useParams();
  const chapterId = params.chapterId as string;

  const containerRef = useRef<HTMLDivElement>(null);

  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [verticalMode, setVerticalMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showUI, setShowUI] = useState(true);

  // Fetch pages
  useEffect(() => {
    if (!chapterId) return;

    fetch(`/api/pages/${chapterId}`)
      .then((res) => res.json())
      .then((data) => {
        setPages(data);
        setLoading(false);

        const saved = localStorage.getItem(`progress-${chapterId}`);
        if (saved) {
          setCurrentPage(Number(saved));
        }
      });

    const mobile = window.innerWidth < 768;
    setVerticalMode(mobile);
  }, [chapterId]);

  // Save progress
  useEffect(() => {
    if (!chapterId) return;
    localStorage.setItem(`progress-${chapterId}`, currentPage.toString());
  }, [currentPage, chapterId]);

  // Vertical scroll page detection
  useEffect(() => {
    if (!verticalMode) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageHeight = window.innerHeight;
      const index = Math.round(scrollY / pageHeight);
      setCurrentPage(index);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [verticalMode]);

  // Horizontal scroll detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container || verticalMode) return;

    const handleScroll = () => {
      const pageWidth = container.clientWidth;
      const index = Math.round(container.scrollLeft / pageWidth);
      setCurrentPage(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [verticalMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (verticalMode) return;

      const container = containerRef.current;
      if (!container) return;

      if (e.key === "ArrowRight") {
        container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
      }

      if (e.key === "ArrowLeft") {
        container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [verticalMode]);

  if (loading)
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        Loading Chapter...
      </div>
    );

  {showUI && (
  <div className="fixed top-0 left-0 right-0 bg-black/70 backdrop-blur-md p-4 flex justify-between items-center z-50">
    <div>
      Page {currentPage + 1} / {pages.length}
    </div>

    <div className="flex gap-3">
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.history.back();
        }}
        className="bg-gray-700 px-3 py-1 rounded"
      >
        Back
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setVerticalMode(!verticalMode);
        }}
        className="bg-gray-800 px-3 py-1 rounded"
      >
        {verticalMode ? "Horizontal" : "Vertical"}
      </button>
    </div>
  </div>
)}

}
