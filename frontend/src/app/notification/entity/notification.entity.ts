import { DeepPartial } from 'src/app/game/entity/game.entity';
import { User } from 'src/app/user';

export interface Notification {
  id: string;

  from?: DeepPartial<User>;

  to: DeepPartial<User>;

  template: string;

  answer?: string;

  expiresAt?: Date;

  answerable: boolean;

  extra: Record<string, string>;
}
