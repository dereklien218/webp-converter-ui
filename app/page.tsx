"use client";

import { useState, DragEvent, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(80);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [slider, setSlider] = useState(50);

  // Create preview URL
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "image/gif") {
      setFile(droppedFile);
    }
  };

  const convert = async () => {
    if (!file) return;

    setLoading(true);
    setConvertedUrl(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality.toString());

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/convert`, {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    setConvertedUrl(url);
    setLoading(false);
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-neutral-950 text-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.25),transparent_60%)]" />

      <div className="relative w-full max-w-md rounded-3xl bg-white/5 backdrop-blur-xl p-8 shadow-2xl border border-white/10">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            GIF → WebP
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Convert animated GIFs into optimized WebP files
          </p>
        </div>

        {/* PREVIEW CARD */}
        {file && previewUrl && (
          <div className="mb-6 relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 group">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                onClick={() => setFile(null)}
                className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition"
              >
                Remove
              </button>
            </div>

            {/* File Info */}
            <div className="p-4">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-neutral-400 mt-1">
                {formatSize(file.size)}
              </p>
            </div>
          </div>
        )}

        {/*  COMPARISON SLIDER */}
        {file && previewUrl && convertedUrl && (
          <div className="mb-6">
            <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/10">

              {/* AFTER (WebP) */}
              <img
                src={convertedUrl}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* BEFORE (GIF clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${slider}%` }}
              >
                <img
                  src={previewUrl}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slider line */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-white"
                style={{ left: `${slider}%` }}
              />

              {/* Handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${slider}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-ew-resize">
                  <div className="w-1 h-4 bg-black" />
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-2 left-2 text-xs bg-black/60 px-2 py-1 rounded">
                Before
              </div>
              <div className="absolute top-2 right-2 text-xs bg-black/60 px-2 py-1 rounded">
                After
              </div>

              {/* Invisible range input for dragging */}
              <input
                type="range"
                min={0}
                max={100}
                value={slider}
                onChange={(e) => setSlider(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
              />
            </div>
          </div>
        )}
        {/* DOWNLOAD BUTTON */}
        {convertedUrl && (
          <button
            onClick={() => {
              const a = document.createElement("a");
              a.href = convertedUrl;
              a.download = "converted.webp";
              a.click();
            }}
            className="mt-2 mb-4 w-full py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 transition cursor-pointer"
          >
            Download WebP
          </button>
        )}

        {/* DROPZONE (only show if no file) */}
        {!file && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput")?.click()}
            className={`
              group relative mb-6 flex cursor-pointer flex-col items-center justify-center
              rounded-2xl border border-dashed p-10 text-center
              transition-all duration-300
              ${
                dragActive
                  ? "border-indigo-400 bg-white/10 shadow-[0_0_40px_rgba(99,102,241,0.25)]"
                  : "border-white/10 hover:border-indigo-400 hover:bg-white/5"
              }
            `}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/gif"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <div className="mb-3 text-indigo-400 text-3xl">⬆</div>
            <p className="font-medium">Drop your GIF here</p>
            <p className="text-xs text-neutral-400 mt-1">
              or click to browse
            </p>
          </div>
        )}

        {/* QUALITY */}
        {file && (
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Quality</span>
              <span className="font-medium">{quality}%</span>
            </div>

            <input
              type="range"
              min={60}
              max={90}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />

            <div className="flex justify-between text-xs text-neutral-500">
              <span>Smaller</span>
              <span>Better</span>
            </div>
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={convert}
          disabled={!file || loading}
          className="
            w-full py-3 rounded-xl text-sm font-medium
            bg-gradient-to-r from-indigo-500 to-purple-500
            hover:from-indigo-400 hover:to-purple-400
            transition-all duration-300
            shadow-lg shadow-indigo-500/20
            hover:shadow-indigo-500/40
            active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          {loading ? "Converting…" : "Convert to WebP"}
        </button>

        {/* LOADING */}
        {loading && (
          <div className="mt-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 animate-pulse w-full" />
            </div>
            <p className="text-xs text-neutral-400 mt-2 text-center">
              Processing your file...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}