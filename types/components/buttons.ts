import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonComponentType = {
  signIn: ReactNode;
  signOut: ReactNode;
  basic: ReactNode;
  text: ReactNode;
  icon: ReactNode;
};

export type BtnVariants = 'basic' | 'signIn' | 'signOut' | 'icon' | 'text';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariants;
  children?: ReactNode;
  onClick?: () => void;
}
