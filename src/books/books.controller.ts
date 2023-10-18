import {
	Controller,
	Param,
	Get,
	Delete,
	Post,
	Put,
	NotFoundException,
	Body,
	UseGuards
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dto/create-book.dto';
import { UpdateBookDTO } from './dto/update-book.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { Book } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
	constructor(private booksService: BooksService) { }

	@Get('/')
	getAll(): any {
		return this.booksService.getAll();
	}

	@Get('/:id')
	async getById(@Param('id', new ParseUUIDPipe()) id: Book['id']) {
		const book = await this.booksService.getById(id);
		if (!book) throw new NotFoundException('Book not found');
		return book;
	}

	@Delete('/:id')
	@UseGuards(JwtAuthGuard)
	async deleteById(@Param('id', new ParseUUIDPipe()) id: Book['id']) {
		if (!(await this.booksService.getById(id)))
			throw new NotFoundException('Book not found');
		await this.booksService.deleteById(id);
		return { success: true }
	}

	@Post('/')
	@UseGuards(JwtAuthGuard)
	public create(@Body() bookData: CreateBookDTO) {
		return this.booksService.create(bookData);
	}

	@Put('/:id')
	@UseGuards(JwtAuthGuard)
	public async update(
		@Param('id', new ParseUUIDPipe()) id: Book['id'],
		@Body() bookData: UpdateBookDTO
	) {
		if (!(await this.booksService.getById(id)))
			throw new NotFoundException('Book not found');

		await this.booksService.updateById(id, bookData);
		return { success: true }
	}
}
