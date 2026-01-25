"use server";

import { FileUploadController } from "../controllers/file-upload.controllers";
import { revalidatePath } from "next/cache";
import type {
  PresignedUrlRequestInput,
  ConfirmUploadInput,
  GetFilesInput,
} from "../validations/schema/file-upload.schema";

const controller = new FileUploadController();

export async function getUploadPresignedUrlAction(
  input: PresignedUrlRequestInput
) {
  return await controller.handleGetUploadUrl(input);
}

export async function confirmFileUploadAction(input: ConfirmUploadInput) {
  const result = await controller.handleConfirmUpload(input);

  if (result.success) {
    revalidatePath("/dashboard/files");
  }

  return result;
}

export async function getDownloadPresignedUrlAction(fileId: string) {
  return await controller.handleGetDownloadUrl(fileId);
}

export async function deleteFileAction(fileId: string) {
  const result = await controller.handleDeleteFile(fileId);

  if (result.success) {
    revalidatePath("/dashboard/files");
  }

  return result;
}

export async function getUserFilesAction(input?: GetFilesInput) {
  return await controller.handleGetUserFiles(input || { page: 1, limit: 20 });
}
