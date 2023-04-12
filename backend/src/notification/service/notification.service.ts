import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entity/notification.entity';
import { Socket } from 'socket.io';
import { Observable, Subject } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private logger = new Logger(NotificationService.name);

  private notificationObservable: Subject<Notification> = new Subject();

  private sockets: Record<string, Socket> = {};

  public constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  public getNotificationObservable(): Observable<Notification> {
    return this.notificationObservable.asObservable();
  }

  public async createNotification(
    request: Omit<Notification, 'id' | 'answerable' | 'answer'>,
  ): Promise<Notification> {
    this.logger.log(
      `new notification from ${request.from?.intraId} to ${request.to.intraId} with template ${request.template}`,
    );

    const notification = await this.notificationRepository.save(request);

    await this.sendNotificationToUser(notification.to.intraId);

    this.notificationObservable.next(notification);

    if (!request.expiresAt) return notification;

    setTimeout(async () => {
      this.logger.log(`notification ${notification.id} expired`);
      await this.updateNotification({
        id: notification.id,
        answerable: false,
      });
    }, request.expiresAt.getTime() - Date.now());

    return notification;
  }

  public async answerNotification(
    request: Pick<Notification, 'id' | 'answer'>,
  ): Promise<Notification> {
    const notification = await this.getNotificationById(request.id);

    this.logger.log(
      `${notification.to.intraId} answered ${request.answer} to ${notification.from?.intraId}`,
    );

    if (notification.answerable === false) throw new Error('Not answerable');

    notification.answer = request.answer;
    notification.answerable = false;

    await this.notificationRepository.save(notification);

    await this.sendNotificationToUser(notification.to.intraId);

    this.notificationObservable.next(notification);

    return notification;
  }

  private async updateNotification(
    notification: Partial<Notification> & Pick<Notification, 'id'>,
  ): Promise<Notification> {
    this.logger.log(`update notification ${notification.id}`);
    const n = await this.notificationRepository.save(notification);
    await this.sendNotificationToUser(notification.to.intraId);
    this.notificationObservable.next(n);
    return n;
  }

  public async getAnswerableNotificationByUser(
    intraId: string,
  ): Promise<Array<Notification>> {
    return await this.notificationRepository.find({
      where: { to: { intraId }, answerable: true },
    });
  }

  public async sendNotificationToUser(intraId: string): Promise<void> {
    const notifications = await this.getAnswerableNotificationByUser(intraId);
    this.getSocketsByUser(intraId).forEach((s) =>
      s.emit('notification:list', notifications),
    );
  }

  public async getNotificationById(id: string): Promise<Notification> {
    return await this.notificationRepository.findOne({ where: { id } });
  }

  public addSocket(socket: Socket): void {
    this.sockets[socket.id] = socket;
    this.sendNotificationToUser(socket['subject']);
  }

  public removeSocket(socket: Socket): void {
    delete this.sockets[socket.id];
  }

  private getSocketsByUser(intraId: string): Array<Socket> {
    return Object.values(this.sockets).filter((s) => s['subject'] === intraId);
  }
}
