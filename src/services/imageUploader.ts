import toast from "react-hot-toast";
import useAuthStore from "../stores/useAuthStore";

interface Loader {
  file: Promise<File | null>;
}

class ImageUploadAdapter {
  loader: Loader;
  token: string | null;

  constructor(loader: Loader) {
    this.loader = loader;
    this.token = useAuthStore.getState().token;
  }

  upload() {
    return this.loader.file.then((file: File | null) => {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }

      return fetch("http://localhost:5001/api/teams/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`, // Add the Bearer token to the header
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          if (!result.url) throw new Error("Failed to upload image");
          return { default: result.url };
        })
        .catch((error) => {
          console.error("Upload failed:", error);
          toast.error("Failed to upload image. Please try again");
          throw error;
        });
    });
  }

  abort() {
    // Optional: Add any necessary cleanup logic here
  }
}

export default ImageUploadAdapter;
