import { useSecuritySettings } from "../hooks/security-settings.hook";
import type { SecurityInfo } from "../services/security-settings.services";

interface SecuritySettingsViewModelProps {
  initialSecurityInfo: SecurityInfo | null;
  initialError?: string | null;
}

export function SecuritySettingsViewModel({
  initialSecurityInfo,
  initialError,
}: SecuritySettingsViewModelProps) {
  const {
    securityInfo,
    isPending,
    error,
    handleEnableTwoFactor,
    handleDisableTwoFactor,
    refreshSecurityInfo,
  } = useSecuritySettings({ initialSecurityInfo, initialError });

  return {
    securityInfo,
    isPending,
    error,
    handleEnableTwoFactor,
    handleDisableTwoFactor,
    refreshSecurityInfo,
  };
}
