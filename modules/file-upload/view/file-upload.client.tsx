"use client";

import { memo, useMemo, useCallback, useReducer } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { FileUploadZone } from "../components/file-upload-zone";
import { FileList } from "../components/file-list";
import { FilePreview } from "../components/file-preview";
import { useFileUpload } from "../hooks/file-upload.hook";
import { FileVisibility, FileCategory } from "../types/file-upload.types";
import type {
  FileUploadData,
  FileUploadZoneLabels,
  FileListLabels,
  FilePreviewLabels,
  PaginatedResponse,
} from "../types/file-upload.types";
import { FILE_UPLOAD_CONFIG } from "../types/file-upload.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FileUploadClientProps {
  initialData: PaginatedResponse<FileUploadData>;
  initialPage: number;
  initialVisibility?: FileVisibility;
  initialCategory?: FileCategory;
}

type DialogState = {
  previewFile: FileUploadData | null;
  deleteFileId: string | null;
};

type DialogAction =
  | { type: "OPEN_PREVIEW"; file: FileUploadData }
  | { type: "CLOSE_PREVIEW" }
  | { type: "OPEN_DELETE"; fileId: string }
  | { type: "CLOSE_DELETE" };

const dialogReducer = (state: DialogState, action: DialogAction): DialogState => {
  switch (action.type) {
    case "OPEN_PREVIEW":
      return { ...state, previewFile: action.file };
    case "CLOSE_PREVIEW":
      return { ...state, previewFile: null };
    case "OPEN_DELETE":
      return { ...state, deleteFileId: action.fileId };
    case "CLOSE_DELETE":
      return { ...state, deleteFileId: null };
    default:
      return state;
  }
};

const initialDialogState: DialogState = {
  previewFile: null,
  deleteFileId: null,
};

const FileUploadClientComponent = ({
  initialData,
  initialPage,
  initialVisibility,
}: FileUploadClientProps) => {
  const t = useTranslations("FileUpload");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dialogState, dispatch] = useReducer(dialogReducer, initialDialogState);

  const { isPending, uploadFiles, downloadFile, deleteFile } = useFileUpload();

  const uploadZoneLabels = useMemo(
    (): FileUploadZoneLabels => ({
      dropzoneTitle: t("dropzone.title"),
      dropzoneDescription: t("dropzone.description"),
      browseButton: t("dropzone.browse"),
      maxSizeText: t("dropzone.maxSize", {
        size: `${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
      }),
      uploadingText: t("dropzone.uploading"),
      errorTitle: t("dropzone.error"),
    }),
    [t]
  );

  const fileListLabels = useMemo(
    (): FileListLabels => ({
      emptyTitle: t("list.empty.title"),
      emptyDescription: t("list.empty.description"),
      downloadButton: tCommon("save"),
      deleteButton: tCommon("delete"),
      previewButton: t("preview.title"),
      confirmDeleteTitle: t("dialogs.delete.title"),
      confirmDeleteMessage: t("dialogs.delete.message"),
    }),
    [t, tCommon]
  );

  const previewLabels = useMemo(
    (): FilePreviewLabels => ({
      closeButton: tCommon("close"),
      downloadButton: tCommon("save"),
      fileDetails: t("preview.details"),
      fileName: t("preview.fileName"),
      fileSize: t("preview.fileSize"),
      uploadDate: t("preview.uploadDate"),
    }),
    [t, tCommon]
  );

  const handleFilesSelected = useCallback(
    (files: File[], visibility: FileVisibility) => {
      uploadFiles(files, visibility);
    },
    [uploadFiles]
  );

  const handleDownload = useCallback(
    (fileId: string) => {
      downloadFile(fileId);
    },
    [downloadFile]
  );

  const handleDeleteRequest = useCallback((fileId: string) => {
    dispatch({ type: "OPEN_DELETE", fileId });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (dialogState.deleteFileId) {
      deleteFile(dialogState.deleteFileId);
      dispatch({ type: "CLOSE_DELETE" });
    }
  }, [deleteFile, dialogState.deleteFileId]);

  const handleDeleteCancel = useCallback(() => {
    dispatch({ type: "CLOSE_DELETE" });
  }, []);

  const handlePreview = useCallback((file: FileUploadData) => {
    dispatch({ type: "OPEN_PREVIEW", file });
  }, []);

  const handleClosePreview = useCallback(() => {
    dispatch({ type: "CLOSE_PREVIEW" });
  }, []);

  const handleTabChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete("visibility");
      } else {
        params.set("visibility", value);
      }
      params.set("page", "1");
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleVisibilityChange = useCallback(
    (value: string) => {
      handleTabChange(value);
    },
    [handleTabChange]
  );

  const currentTab = initialVisibility || "all";

  return (
    <div className="space-y-6">
      <FileUploadZone
        labels={uploadZoneLabels}
        visibility={FileVisibility.PRIVATE}
        isPending={isPending}
        onFilesSelected={handleFilesSelected}
      />

      <div className="flex items-center justify-between">
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
              <TabsTrigger value="PUBLIC">{t("tabs.public")}</TabsTrigger>
              <TabsTrigger value="PRIVATE">{t("tabs.private")}</TabsTrigger>
            </TabsList>

            <Select
              value={currentTab}
              onValueChange={handleVisibilityChange}
            >
              <SelectTrigger className="w-40 md:hidden">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("tabs.all")}</SelectItem>
                <SelectItem value="PUBLIC">{t("tabs.public")}</SelectItem>
                <SelectItem value="PRIVATE">{t("tabs.private")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value={currentTab} className="mt-4">
            <FileList
              files={initialData.data}
              labels={fileListLabels}
              locale={locale}
              isPending={isPending}
              onDownload={handleDownload}
              onDelete={handleDeleteRequest}
              onPreview={handlePreview}
            />
          </TabsContent>
        </Tabs>
      </div>

      <FilePreview
        file={dialogState.previewFile}
        labels={previewLabels}
        locale={locale}
        isOpen={dialogState.previewFile !== null}
        onClose={handleClosePreview}
        onDownload={handleDownload}
      />

      <AlertDialog open={dialogState.deleteFileId !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {fileListLabels.confirmDeleteTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {fileListLabels.confirmDeleteMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              {tCommon("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const FileUploadClient = memo(FileUploadClientComponent);
FileUploadClient.displayName = "FileUploadClient";
