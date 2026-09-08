/** One entry in the shell's primary navigation. */
export interface NavItem {
  label: string;
  /** Router link. Omit for a disabled / "coming soon" placeholder. */
  route?: string;
  /** Optional count badge (e.g. unread, needs-attention). Falsy hides it. */
  badge?: number;
  queryParams?: Record<string, string | number | boolean>;
  /** Restrict this item to admins (checked against `ExampleAuthService.isAdmin`). */
  adminOnly?: boolean;
}
