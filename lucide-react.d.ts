// lucide-react.d.ts
declare module 'lucide-react' {
  import { SVGProps } from 'react';

  export type LucideProps = SVGProps<SVGSVGElement> & {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  };

  export type LucideIcon = React.FC<LucideProps>;

  export const AlertTriangle: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Users: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const Stethoscope: LucideIcon;
  export const FlaskConical: LucideIcon; // Example, replace with actual if used
  export const Settings: LucideIcon;
  export const LogIn: LucideIcon;
  export const UserPlus: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const Search: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const FileText: LucideIcon;
  export const Edit: LucideIcon;
  export const Trash2: LucideIcon;
  export const Filter: LucideIcon;
  export const Eye: LucideIcon;
  export const CalendarPlus: LucideIcon;
  export const Clock: LucideIcon;
  export const Bot: LucideIcon;
  export const Moon: LucideIcon;
  export const Sun: LucideIcon;
  export const LogOut: LucideIcon;
  export const PanelLeft: LucideIcon;
  export const X: LucideIcon;
  export const Check: LucideIcon;
  export const Circle: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const BriefcaseMedical: LucideIcon;

  // Add other icons as needed by your application from lucide-react
  // This is not an exhaustive list. Refer to lucide-react documentation for all available icons.
}
