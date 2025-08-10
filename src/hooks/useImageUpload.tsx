/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

/**
 * Simple image upload hook for Vite + React using ImgBB.
 * 1. Set VITE_IMGBB_API_KEY in your .env.local
 * 2. Returns uploadImage(file) -> string | null (URL)
 */
export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      setError("IMGBB API key is missing (VITE_IMGBB_API_KEY)");
      return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploading(true);
      setError(null);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data?.success) {
        const url: string = data.data?.url;
        setUploadedUrl(url);
        return url;
      } else {
        const msg = data?.error?.message || "Image upload failed";
        setError(msg);
        return null;
      }
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadedUrl,
    error,
    uploadImage,
  };
}
