"use client";

import { useCallback, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getUploadPresignedUrlAction,
  confirmFileUploadAction,
  getDownloadPresignedUrlAction,
  deleteFileAction,
} from "../actions/file-upload.actions";
import type { FileVisibility } from "../types/file-upload.types";
import type { FileUploadData } from "../types/file-upload.types";

interface UseFileUploadProps {
  onUploadComplete?: (file: FileUploadData) => void;
  onDeleteComplete?: (fileId: string) => void;
}

export function useFileUpload(props?: UseFileUploadProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const uploadProgressRef = useRef<Map<string, number>>(new Map());

  const uploadFile = useCallback(
    async (file: File, visibility: FileVisibility) => {
      const presignedResult = await getUploadPresignedUrlAction({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        visibility,
      });

      if (presignedResult.error || !presignedResult.data) {
        toast.error(presignedResult.error || "Error al obtener URL de subida");
        return null;
      }

      const { uploadUrl, fileKey } = presignedResult.data;

      try {
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir archivo a S3");
        }
      } catch (error) {
        toast.error("Error al subir archivo");
        console.error("S3 upload error:", error);
        return null;
      }

      const confirmResult = await confirmFileUploadAction({
        fileKey,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        visibility,
      });

      if (confirmResult.error) {
        toast.error(confirmResult.error);
        return null;
      }

      toast.success(confirmResult.success || "Archivo subido exitosamente");
      props?.onUploadComplete?.(confirmResult.data!);

      return confirmResult.data;
    },
    [props]
  );

  const uploadFiles = useCallback(
    (files: File[], visibility: FileVisibility) => {
      startTransition(async () => {
        const results = await Promise.allSettled(
          files.map((file) => uploadFile(file, visibility))
        );

        const successful = results.filter(
          (r) => r.status === "fulfilled" && r.value !== null
        ).length;

        if (successful > 0) {
          router.refresh();
        }

        if (successful < files.length) {
          toast.warning(`${successful} de ${files.length} archivos subidos`);
        }
      });
    },
    [uploadFile, router]
  );

  const downloadFile = useCallback((fileId: string) => {
    startTransition(async () => {
      const result = await getDownloadPresignedUrlAction(fileId);

      if (result.error || !result.data) {
        toast.error(result.error || "Error al obtener URL de descarga");
        return;
      }

      window.open(result.data.url, "_blank");
    });
  }, []);

  const deleteFile = useCallback(
    (fileId: string) => {
      startTransition(async () => {
        const result = await deleteFileAction(fileId);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        toast.success(result.success || "Archivo eliminado");
        props?.onDeleteComplete?.(fileId);
        router.refresh();
      });
    },
    [router, props]
  );

  return {
    isPending,
    uploadFile,
    uploadFiles,
    downloadFile,
    deleteFile,
  };
}
