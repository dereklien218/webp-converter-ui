"use client";

import { useState, DragEvent } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(80);

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

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality.toString());

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/convert`, {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.webp";
    a.click();

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
      <div className="w-full max-w-md rounded-3xl bg-neutral-900 p-8 shadow-2xl ring-1 ring-white/10">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          GIF → WebP Converter
        </h1>

        <p className="text-sm text-neutral-400 mb-6">
          Turn animated GIFs into lightweight WebP files.
        </p>

        {/* DROP ZONE */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`mb-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition-all
            ${
              dragActive
                ? "border-white bg-white/5"
                : "border-white/10 hover:border-white/20"
            }`}
          onClick={() =>
            document.getElementById("fileInput")?.click()
          }
        >
          <input
            id="fileInput"
            type="file"
            accept="image/gif"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          {file ? (
            <>
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-neutral-400 mt-1">
                Ready to convert
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">
                Drop your GIF here
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                or click to browse
              </p>
            </>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-neutral-400">Quality</span>
            <span className="font-medium">{quality}</span>
          </div>

          <input
            type="range"
            min={60}
            max={90}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-white"
          />

          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>Smaller</span>
            <span>Better</span>
          </div>
        </div>

        <button
          onClick={convert}
          disabled={!file || loading}
          className="w-full rounded-xl bg-white py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50 cursor-pointer">
          {loading ? "Converting…" : "Convert to WebP"}
        </button>
      </div>
    </main>
  );
}
