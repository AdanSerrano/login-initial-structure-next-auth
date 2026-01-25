"use client";

import { memo, useCallback, useRef, useTransition } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  getUploadPresignedUrlAction,
  confirmFileUploadAction,
} from "@/modules/file-upload/actions/file-upload.actions";
import { updateProfileImageAction } from "../actions/user.actions";
import { FileVisibility } from "@/modules/file-upload/types/file-upload.types";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB for profile images
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

interface ProfileImageUploadLabels {
  uploadButton: string;
  uploadingText: string;
  errorInvalidType: string;
  errorTooLarge: string;
  errorUpload: string;
  successUpload: string;
}

interface ProfileImageUploadProps {
  currentImage: string | null;
  name: string | null;
  labels: ProfileImageUploadLabels;
  onImageChange?: (imageUrl: string) => void;
  disabled?: boolean;
}

const ProfileImageUploadComponent = ({
  currentImage,
  name,
  labels,
  onImageChange,
  disabled = false,
}: ProfileImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const getInitials = useCallback((userName: string | null) => {
    if (!userName) return "U";
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const handleButtonClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error(labels.errorInvalidType);
        return;
      }

      // Validate file size
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(labels.errorTooLarge);
        return;
      }

      startTransition(async () => {
        try {
          // Get presigned URL for PUBLIC upload
          const presignedResult = await getUploadPresignedUrlAction({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            visibility: FileVisibility.PUBLIC,
          });

          if (presignedResult.error || !presignedResult.data) {
            toast.error(presignedResult.error || labels.errorUpload);
            return;
          }

          const { uploadUrl, fileKey } = presignedResult.data;

          // Upload to R2
          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          if (!uploadResponse.ok) {
            throw new Error("Upload failed");
          }

          // Confirm upload and get public URL
          const confirmResult = await confirmFileUploadAction({
            fileKey,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            visibility: FileVisibility.PUBLIC,
          });

          if (confirmResult.error || !confirmResult.data) {
            toast.error(confirmResult.error || labels.errorUpload);
            return;
          }

          const publicUrl = confirmResult.data.publicUrl;

          if (!publicUrl) {
            toast.error(labels.errorUpload);
            return;
          }

          // Save image URL to user profile directly
          const updateResult = await updateProfileImageAction(publicUrl);

          if (updateResult.error) {
            toast.error(updateResult.error);
            return;
          }

          // Notify parent component if callback provided
          onImageChange?.(publicUrl);

          // Refresh to update UI
          router.refresh();

          toast.success(labels.successUpload);
        } catch (error) {
          console.error("Profile image upload error:", error);
          toast.error(labels.errorUpload);
        }
      });

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [labels, onImageChange, router]
  );

  const isDisabled = disabled || isPending;

  return (
    <div className="relative inline-block">
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isDisabled}
      />

      <Avatar className="h-20 w-20 border-2 border-border">
        <AvatarImage src={currentImage || undefined} alt={name || ""} />
        <AvatarFallback className="text-lg bg-primary/10 text-primary">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md"
        onClick={handleButtonClick}
        disabled={isDisabled}
        title={labels.uploadButton}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export const ProfileImageUpload = memo(ProfileImageUploadComponent);
ProfileImageUpload.displayName = "ProfileImageUpload";
