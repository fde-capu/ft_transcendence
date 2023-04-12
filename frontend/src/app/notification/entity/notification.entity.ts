import { User } from 'src/app/user';

export interface Notification {
  id: string;

  from?: User;

  to: User;

  template: string;

  answer?: string;

  expiresAt?: Date;

  answerable: boolean;

  extra: Record<string, string>;
}
