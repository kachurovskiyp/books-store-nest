import {
	Controller,
	Get,
	Param,
	NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('users')
export class UsersController { 
	constructor(private usersService: UsersService) {}

	@Get('/')
	getAll(): any {
		return this.usersService.getAll();
	}

	@Get('/:id')
	async getById(@Param('id', new ParseUUIDPipe()) id:User['id']) {
		const user = await this.usersService.getById(id);
		if(!user) throw new NotFoundException('User not found');
		return user;
	}
}
