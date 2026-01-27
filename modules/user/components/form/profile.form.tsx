"use client";

import { memo, useCallback, useMemo } from "react";
import { Form } from "@/components/ui/form";
import {
  FormTextField,
  FormErrorAlert,
  FormSubmitButton,
  FormButtonGroup,
} from "@/components/ui/form-fields";
import { ProfileViewModel } from "../../view-model/user.view-model";
import { useTranslations } from "next-intl";
import { ProfileImageUpload } from "../profile-image-upload";

interface ProfileFormProps {
  defaultValues?: {
    name?: string | null;
    userName?: string | null;
    image?: string | null;
    email?: string | null;
  };
}

export const ProfileForm = memo(function ProfileForm({
  defaultValues,
}: ProfileFormProps) {
  const t = useTranslations("Profile");
  const tCommon = useTranslations("Common");
  const { handleSubmit, form, isPending, error } = ProfileViewModel({
    defaultValues: {
      name: defaultValues?.name ?? "",
      userName: defaultValues?.userName ?? "",
      image: defaultValues?.image ?? "",
    },
  });

  const watchedImage = form.watch("image");
  const watchedName = form.watch("name");

  const handleImageChange = useCallback(
    (imageUrl: string) => {
      form.setValue("image", imageUrl, { shouldDirty: false });
    },
    [form]
  );

  const imageUploadLabels = useMemo(
    () => ({
      uploadButton: t("uploadImage"),
      uploadingText: t("uploadingImage"),
      errorInvalidType: t("errorInvalidImageType"),
      errorTooLarge: t("errorImageTooLarge"),
      errorUpload: t("errorImageUpload"),
      successUpload: t("successImageUpload"),
    }),
    [t]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex items-center gap-6">
          <ProfileImageUpload
            currentImage={watchedImage || null}
            name={watchedName || null}
            labels={imageUploadLabels}
            onImageChange={handleImageChange}
            disabled={isPending}
          />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {t("imageUploadHint")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <FormTextField
            control={form.control}
            name="name"
            label={t("fullName")}
            placeholder={t("fullNamePlaceholder")}
            disabled={isPending}
          />

          <FormTextField
            control={form.control}
            name="userName"
            label={t("username")}
            placeholder={t("usernamePlaceholder")}
            description={t("usernameHint")}
            disabled={isPending}
          />
        </div>

        <FormErrorAlert error={error} />

        <FormButtonGroup align="right">
          <FormSubmitButton
            isPending={isPending}
            text={t("saveChanges")}
            loadingText={tCommon("saving")}
          />
        </FormButtonGroup>
      </form>
    </Form>
  );
});
