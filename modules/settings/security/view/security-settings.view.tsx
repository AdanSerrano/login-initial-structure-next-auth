import { SecuritySettingsForm } from "../components/security-settings.form";
import { getSecurityInfoAction } from "../actions/security-settings.actions";
import { getActiveSessionsAction, getRecentActivityAction } from "@/modules/sessions/actions/sessions.actions";
import { SecuritySettingsSkeleton } from "../components/security-settings.skeleton";

export async function SecuritySettingsView() {
  // Fetch all data in parallel on the server
  const [securityResult, sessionsResult, activityResult] = await Promise.all([
    getSecurityInfoAction(),
    getActiveSessionsAction(),
    getRecentActivityAction(1, 10),
  ]);

  const securityInfo = securityResult.error ? null : securityResult.data ?? null;
  const securityError = securityResult.error ?? null;

  const sessions = sessionsResult.error ? [] : sessionsResult.sessions ?? [];
  const sessionsError = sessionsResult.error ?? null;

  const activities = "error" in activityResult ? [] : activityResult.data;
  const activityPagination = "error" in activityResult ? null : activityResult.pagination;
  const activityError = "error" in activityResult ? activityResult.error : null;

  // If there's a critical error loading security info, show skeleton as fallback
  if (securityError && !securityInfo) {
    return <SecuritySettingsSkeleton />;
  }

  return (
    <SecuritySettingsForm
      initialSecurityInfo={securityInfo}
      initialSecurityError={securityError}
      initialSessions={sessions}
      initialSessionsError={sessionsError}
      initialActivities={activities}
      initialActivityPagination={activityPagination}
      initialActivityError={activityError}
    />
  );
}
