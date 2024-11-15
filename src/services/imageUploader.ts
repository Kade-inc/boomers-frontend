import toast from "react-hot-toast";
import useAuthStore from "../stores/useAuthStore";
import useLoadingStore from "../stores/useLoadingStore";

interface Loader {
  file: Promise<File | null>;
}

class ImageUploadAdapter {
  loader: Loader;
  token: string | null;
  setLoading: (loading: boolean) => void;

  constructor(loader: Loader) {
    this.loader = loader;
    this.token = useAuthStore.getState().token;
    this.setLoading = useLoadingStore.getState().setLoading;
  }

  upload() {
    this.setLoading(true);

    return this.loader.file.then((file: File | null) => {
      if (!file) {
        this.setLoading(false);
        return Promise.reject("No file to upload");
      }

      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }

      return fetch("http://localhost:5001/api/teams/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          this.setLoading(false);
          if (!result.url) throw new Error("Failed to upload image");
          return { default: result.url };
        })
        .catch((error) => {
          this.setLoading(false);
          console.error("Upload failed:", error);
          toast.error("Failed to upload image. Please try again");
          throw error;
        });
    });
  }

  abort() {
    // Optional: Add any necessary cleanup logic here
    this.setLoading(false);
  }
}

export default ImageUploadAdapter;
