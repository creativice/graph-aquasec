export type AquaSecAccount = {
  id: number;
  stripe_id: string | null;
  trial_end: string;
  created: string;
  current_plan: number;
  additional_credits: number;
  num_allowed_keys: number;
  suppressions_admin_only: boolean;
  global_suppressions_admin_only: boolean;
  source: string;
  enforce_oauth: boolean;
  users_admin_only: boolean;
  integrations_admin_only: boolean;
  disable_default_emails: boolean;
  block_default_group: boolean;
  presuppress_plugins: boolean;
  associate_tags: boolean;
  aws_marketplace_id: string;
  csp_enabled: boolean;
  root_user: string;
};

export type AquaSecUser = {
  id: number;
  email: string;
  confirmed: boolean;
  password_reset: boolean;
  send_announcements: boolean;
  send_scan_results: boolean;
  send_new_plugins: boolean;
  send_new_risks: boolean;
  account_admin: boolean;
  created: string;
  multiaccount: boolean;
};
