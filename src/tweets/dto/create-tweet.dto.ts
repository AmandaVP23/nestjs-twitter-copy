import { MaxLength } from 'class-validator';

export class CreateTweetDto {
    @MaxLength(140)
    text: string;
}
