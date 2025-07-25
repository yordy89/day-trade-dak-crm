import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { CreditCard } from '@phosphor-icons/react/dist/ssr/CreditCard';
import { CalendarCheck, Buildings, Book, ChalkboardTeacher, Student, ChartLineUp, Brain, GraduationCap, ChartLine, TreeStructure, Leaf } from '@phosphor-icons/react';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  calendar: CalendarCheck,
  companies: Buildings,
  user: UserIcon,
  users: UsersIcon,
  mentorship: ChalkboardTeacher,
  class: Student,
  stocks: ChartLineUp,
  book: Book,
  brain: Brain,
  psicotrading: Brain,
  graduation: GraduationCap,
  'chart-line': ChartLine,
  'credit-card': CreditCard,
  settings: GearSixIcon,
  'personal-growth': TreeStructure,
  leaf: Leaf,
} as Record<string, Icon>;
