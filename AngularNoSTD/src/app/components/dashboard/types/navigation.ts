export interface NavItem {
  title: string;
  icon: string;
  path?: string;
  children?: NavItem[];
  isActive?: boolean;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userName: string;
  userImage: string;
}

