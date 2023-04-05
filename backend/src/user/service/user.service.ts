import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFortyTwoApi } from 'src/forty-two/service/user';
import { Repository } from 'typeorm';
import { registerResp, UserDTO } from '../dto/user.dto';
import { Users } from '../entity/user.entity';
import { ConfigService } from '@nestjs/config';

export interface TokenDTO {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

@Injectable()
export class UserService {
  public static status: Map<string, string> = new Map<string, string>();
  static attendance: Map<string, number> = new Map<string, number>();
  static attOnce?: boolean;
	private static logOffTimeOut: number = 1000 * 60 * 20; // 20 minutes

  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly configService: ConfigService,
  ) {
    if (!UserService.attOnce) this.checkOnStudents();
  }

  async registerUserOk42(codeFrom42: UserFortyTwoApi): Promise<registerResp> {
    let existUser = await this.userRepository.findOneBy({
      intraId: codeFrom42.login,
    });
    if (existUser === null) {
      const createdUser = this.userRepository.create({
        intraId: codeFrom42.login,
        email: codeFrom42.email,
        name: codeFrom42.displayname,
        image: codeFrom42.image.versions.medium,
        friends: [],
        blocks: [],
        score: 0,
      });
      existUser = await this.userRepository.save(createdUser);
    }

    await this.updateUser(existUser.intraId, { mfa_verified: false });
    // TODO: pode desimplementar o registro do mfa_verified na db (não está em uso).
    return {
      intraId: existUser.intraId,
      mfa_enabled: existUser.mfa_enabled,
      mfa_verified: false,
    };
  }

  async updateUser(intraId: string, user: Users) {
    const filtered_user = {
      name: user.name,
      image: user.image,
      friends: user.friends,
      blocks: user.blocks,
      score: user.score,
      mfa_enabled: user.mfa_enabled,
      mfa_verified: user.mfa_verified,
    };
    const resp = await this.userRepository
      .createQueryBuilder()
      .update(Users)
      .set(filtered_user)
      .where('intraId = :intraId', { intraId: intraId })
      .execute();
    if (resp.affected === 0) {
      throw new NotFoundException();
      // TODO: this exception is not been handled and is crashing the server
			// This happens only if a malicious user tries to update an
			// unexisten user.
    }
    return resp;
  }

  async getUserByIntraId(u_intraId: string): Promise<UserDTO> {
    const resp = await this.userRepository.findOneBy({ intraId: u_intraId });

    if (resp === null) {
      return;
    }
    return this.singleUserDto(resp);
  }

  async getFullUser(u_intraId: string): Promise<Users> {
    const resp = await this.userRepository.findOneBy({ intraId: u_intraId });
    if (resp === null) {
      throw new NotFoundException();
    }
    return resp;
  }

  async getOnlineUsers(): Promise<UserDTO[]> {
    const resp = await this.userRepository
      .createQueryBuilder('allUsers')
      .select()
      .getMany();
    const out = [];
    for (const u of resp)
      if (UserService.status.get(u.intraId) != 'OFFLINE')
				out.push(u);
    return this.makeUserDto(out);
  }

  async getAvailableUsers(): Promise<UserDTO[]> {
    const resp = await this.userRepository
      .createQueryBuilder('allUsers')
      .select()
      .getMany();
    const out = [];
    for (const u of resp)
      if (
        UserService.status.get(u.intraId) != 'OFFLINE' &&
        UserService.status.get(u.intraId) != 'INGAME'
      )
        out.push(u);
    return this.makeUserDto(out);
  }

  async getAllUsers(): Promise<UserDTO[]> {
    const resp = await this.userRepository
      .createQueryBuilder('allUsers')
      .select()
      .getMany();
    return this.makeUserDto(resp);
  }

  async getFriends(intraId: string): Promise<UserDTO[]> {
    const out: UserDTO[] = [];
    const u = await this.getFullUser(intraId);
    if (!u || !u.friends) {
      return out;
    }
    for (const friend of u.friends) {
      const n = await this.getUserByIntraId(friend);
      if (!n) return;
      out.push(n);
    }
    return out;
  }

  async getBlocks(intraId: string): Promise<UserDTO[]> {
    const out: UserDTO[] = [];
    const u = await this.getFullUser(intraId);
    if (!u || !u.blocks) {
      return out;
    }
    for (const block of u.blocks) {
      const n = await this.getUserByIntraId(block);
      if (!n) return;
      out.push(n);
    }
    return out;
  }

  singleUserDto(u_user: Users): UserDTO {
    return this.makeUserDto([u_user])[0];
  }

  makeUserDto(u_users: Users[]): UserDTO[] {
    if (!u_users.length) return [];
    const out: UserDTO[] = [];
    u_users.forEach(function (u) {
      const dto: UserDTO = {
        intraId: u.intraId,
        name: u.name,
        image: u.image,
        score: u.score,
        mfa_enabled: u.mfa_enabled,
        friends: u.friends,
        blocks: u.blocks,
        status: UserService.status.get(u.intraId)
          ? UserService.status.get(u.intraId)
          : 'OFFLINE',
      };
      out.push(dto);
    });
    return out;
  }

  async checkOnStudents() {
    UserService.attOnce = true;
    await new Promise((resolve) => setTimeout(resolve, 3391));
    if (!UserService.attendance) return this.checkOnStudents();
    for (const [u, d] of UserService.attendance.entries()) {
      const elapsed = Date.now() - d;
      if (elapsed > UserService.logOffTimeOut) {
        UserService.attendance.delete(u);
        UserService.status.set(u, 'OFFLINE');
      }
    }
    this.checkOnStudents();
  }

  presence(intraId: string) {
    UserService.attendance.set(intraId, Date.now());
  }

  async updateProfileImage(intraId: string, imagePath: string) {
    return await this.userRepository.update(
      { intraId },
      { image: `${this.configService.get('FRONTEND_ORIGIN')}/${imagePath}` },
    );
  }
}
