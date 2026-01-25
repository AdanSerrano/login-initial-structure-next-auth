"use client";

import { memo, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
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
      // Update form value so the UI stays in sync
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fullName")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("fullNamePlaceholder")}
                    disabled={isPending}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("username")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("usernamePlaceholder")}
                    disabled={isPending}
                    className="bg-background"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  {t("usernameHint")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tCommon("saving")}
              </>
            ) : (
              t("saveChanges")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
});
