import { ReactNode } from 'react';

import { Session } from 'next-auth';

export interface BaseLayoutProps {
  children: ReactNode;
  page: string;
  navigation: any[];
  session: Session;
}
