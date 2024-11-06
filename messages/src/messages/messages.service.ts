import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class MessagesService {
  constructor(private messagesRepo: MessagesRepository) {}

  async findOne(id: string) {
    const message = await this.messagesRepo.findOne(id);
    if (!message) {
      throw new NotFoundException('message not found');
    }
    return message;
  }

  findAll() {
    return this.messagesRepo.findAll();
  }

  create(content: string) {
    return this.messagesRepo.create(content);
  }
}
