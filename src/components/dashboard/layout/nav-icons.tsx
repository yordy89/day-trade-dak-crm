import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { CalendarCheck, Buildings } from '@phosphor-icons/react';
import { Book } from '@phosphor-icons/react';
import { ChalkboardTeacher } from '@phosphor-icons/react';
import { Student } from '@phosphor-icons/react';


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
  book: Book,
} as Record<string, Icon>;
