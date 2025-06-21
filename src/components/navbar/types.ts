import { LucideProps } from "lucide-react";

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
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  profile?: {
    full_name: string;
    role: string;
  };
  handleSignOut?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};
