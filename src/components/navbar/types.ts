import { LucideProps } from "lucide-react";
import { AuthUser, UserProfile } from "@/types/user";

export type navItemType = {
  href: string;
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}[];

export type NavbarProps = {
  navItems: navItemType;
  isActive: (href: string) => boolean;
  user: AuthUser | null;
  profile: UserProfile | null;
  handleSignOut?: () => void;
  isSigningOut?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type UserMenuProps = {
  profile: UserProfile | null;
  setSignOutDialog: (open: boolean) => void;
  signOutDialog: boolean;
  isSigningOut?: boolean;
  handleSignOut?: () => void;
};
