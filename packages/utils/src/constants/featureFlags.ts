type FeatureFlags = {
  enableTenantSwitcher: boolean
  enableAppearanceSettings: boolean
  enableThemeToggle: boolean
  enableOnboardingFlow: boolean
  enableOauthLogin: boolean
  enableInviteUsers: boolean
  enableBillingHistory: boolean
  enableNotifications: boolean
}

/**
 * Application Feature Flags
 *
 * Toggle features on or off within the application. Modify and select different configurations here.
 *
 * @property enableTenantSwitcher - Enable the tenant switcher in the navbar
 * @property enableAppearanceSettings - Enable the appearance settings in the settings page (dark/light mode)
 * @property enableThemeToggle - Enable the theme toggle in the navbar (dark/light mode)
 * @property enableOnboardingFlow - Enable the onboarding flow for new users
 * @property enableOauthLogin - Enable the oauth login for new users
 * @property enableInviteUsers - Enable the invite users for new users
 * @property enableBillingHistory - Enable the billing history for new users
 * @property enableNotifications - Enable the notifications for new users
 */
export const featureFlags: FeatureFlags = {
  enableTenantSwitcher: true,
  enableAppearanceSettings: true,
  enableThemeToggle: true,
  enableOnboardingFlow: true,
  enableOauthLogin: false,
  enableInviteUsers: false,
  enableBillingHistory: false,
  enableNotifications: true,
}
