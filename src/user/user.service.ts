import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserService {
    private readonly users: User[] = [];


    updateUser(user: User): void {
        // Логика обновления пользователя
    }

    logReplyToRequest(requestId: number, replyDetails: any): void {
        // Логика ответа на заявку от поставщика
    }

    viewRequestHistory(userId: number): any {
        // Логика просмотра истории заявок
    }

}
