"use client";

import { useRequestMagicLink } from "../hooks/magic-link.hook";
import { RequestMagicLinkInput } from "../validations/schema/magic-link.schema";

export function MagicLinkViewModel() {
  const { requestMagicLink, isPending, error, success, form } =
    useRequestMagicLink();

  const handleSubmit = async (values: RequestMagicLinkInput) => {
    await requestMagicLink(values);
  };

  return { handleSubmit, form, isPending, error, success };
}
