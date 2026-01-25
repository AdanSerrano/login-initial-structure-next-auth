import { FileUploadView } from "@/modules/file-upload/view/file-upload.view";
import { FileUploadSkeleton } from "@/modules/file-upload/components/file-upload.skeleton";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FileUpload");
  return {
    title: t("title"),
    description: t("description"),
  };
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
    visibility?: string;
    category?: string;
  }>;
}

export default async function FilesPage({ searchParams }: PageProps) {
  const t = await getTranslations("FileUpload");
  const params = await searchParams;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <Suspense fallback={<FileUploadSkeleton />}>
        <FileUploadView searchParams={params} />
      </Suspense>
    </div>
  );
}
