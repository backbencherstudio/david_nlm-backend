import { Controller, Get, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { Request } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('notification')
@UseGuards(JwtAuthGuard) 
export class NotificationController {

  constructor(private readonly notificationService: NotificationService) {}

  
  @Get('user-notification')
  async getAllUserNotifications(@Req() req: Request) {
    const userId = req.user.userId; 
    return this.notificationService.findAllNotificationsForUser(userId);
  }

 
  @Patch('delete-notification/:id')
  async deleteUserNotification(
    @Req() req: Request, 
    @Param('id') id: string) {
    const userId = req.user.userId; 
    return this.notificationService.deleteNotificationForUser(id, userId);
  }








}
