import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
    NotFoundException, Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../authentication/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Tweets')
@Controller('tweets')
export class TweetsController {
    constructor(private readonly tweetsService: TweetsService) {}

    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findAll(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10,
    ) {
        limit = limit > 100 ? 100 : limit;
        return this.tweetsService.findAll({
            page,
            limit,
        });
    }

    @Post()
    @ApiOperation({
        description: 'Create a new tweet'
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    create(@Body() createTweetDto: CreateTweetDto, @GetUser() user: User) {
        return this.tweetsService.create(createTweetDto, user);
    }

    @Get('/by-user/:username')
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findByUser(
        @Param('username') username: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        limit = limit > 100 ? 100 : limit;
        return this.tweetsService.findByUser(username, {
            page,
            limit,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        console.log("--dir", process.cwd());
        return this.tweetsService.findOne(+id);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
        this.tweetsService.remove(+id, user);
        return 'ok';
    }
}
