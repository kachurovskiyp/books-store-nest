import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { User } from '@prisma/client';
import { Password } from '@prisma/client';

@Injectable()
export class UsersService {
	constructor(private prismaService: PrismaService) { }

	public async getAll(): Promise<User[]> {
		return this.prismaService.user.findMany({
			include: {
				books: {
					include: {
						book: true,
					},
				},
			},
		});
	}

	public getById(id: User['id']): Promise<User | null> {
		return this.prismaService.user.findUnique({
			where: { id }
		});
	}

	public getByEmail(email: User['email']): Promise<User & { password: Password } | null> {
		return this.prismaService.user.findUnique({
			where: { email },
			include: { password: true }
		});
	}

	public async create(
		userData: { email: string, password: string }
	): Promise<User> {
		const { password, ...otherData } = userData;
		try {
			return await this.prismaService.user.create({
				data: {
					...otherData,
					password: {
						create: {
							hashedPassword: password,
						},
					},
				},
			});
		} catch (error) {
			if (error.code === 'P2025')
				throw new BadRequestException('User doesn\'t exist');
			throw error;
		}
	}

	public async updateById(
		userId: User['id'],
		userData: { email: string, password: string | undefined }
	): Promise<User> {
		const { password, ...otherData } = userData;

		if (password) {
			return await this.prismaService.user.update({
				where: { id: userId },
				data: {
					...otherData,
					password: {
						update: {
							hashedPassword: password,
						},
					},
				},
			});
		} else {
			return await this.prismaService.user.update({
				where: { id: userId },
				data: { email: userData.email }
			});
		}
	}

	public deleteById(id: User['id']): Promise<User> {
		return this.prismaService.user.delete({
			where: { id },
		});
	}
}
