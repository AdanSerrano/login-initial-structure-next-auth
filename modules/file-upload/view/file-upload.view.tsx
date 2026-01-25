import { getTranslations } from "next-intl/server";
import { getUserFilesAction } from "../actions/file-upload.actions";
import { FileUploadClient } from "./file-upload.client";
import type { FileVisibility, FileCategory } from "../types/file-upload.types";

interface FileUploadViewProps {
  searchParams?: {
    page?: string;
    visibility?: string;
    category?: string;
  };
}

export async function FileUploadView({ searchParams }: FileUploadViewProps) {
  const t = await getTranslations("FileUpload");

  const page = parseInt(searchParams?.page || "1");
  const visibility = searchParams?.visibility as FileVisibility | undefined;
  const category = searchParams?.category as FileCategory | undefined;

  const result = await getUserFilesAction({
    page,
    limit: 20,
    visibility,
    category,
  });

  if (result.error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  return (
    <FileUploadClient
      initialData={result.data!}
      initialPage={page}
      initialVisibility={visibility}
      initialCategory={category}
    />
  );
}
