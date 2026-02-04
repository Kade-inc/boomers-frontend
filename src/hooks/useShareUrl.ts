import { useState } from "react";
import toast from "react-hot-toast";
import APIClient from "../services/apiClient";
import * as Sentry from "@sentry/react";

interface UseShareUrlOptions {
  resourceType: "challenge" | "solution" | "team";
  resourceId: string;
  /** The frontend route path (e.g., /challenge/123 or /teams/456) */
  frontendPath: string;
}

interface UseShareUrlReturn {
  share: () => Promise<void>;
  isLoading: boolean;
  shortUrl: string | null;
}

/**
 * Hook for generating and sharing short URLs
 */
export function useShareUrl({
  resourceType,
  resourceId,
  frontendPath,
}: UseShareUrlOptions): UseShareUrlReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);

  const share = async () => {
    if (!resourceId) {
      toast.error("Cannot share: Resource ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const apiClient = new APIClient();
      const baseUrl = window.location.origin;
      const originalUrl = `${baseUrl}${frontendPath}`;

      const result = await apiClient.createShortUrl(
        originalUrl,
        resourceType,
        resourceId,
      );

      setShortUrl(result.shortUrl);

      // Copy to clipboard
      await navigator.clipboard.writeText(result.shortUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      Sentry.captureException(error, {
        extra: { context: "Error creating short URL" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { share, isLoading, shortUrl };
}

export default useShareUrl;
