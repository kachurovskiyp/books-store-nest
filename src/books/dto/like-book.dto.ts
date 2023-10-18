import {
	IsNotEmpty,
	IsString,
	IsUUID
} from "class-validator";

export class LikeBookDTO {
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	bookId: string;

	@IsNotEmpty()
	@IsString()
	@IsUUID()
	userId: string;
}