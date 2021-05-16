import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FollowService } from './follow.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../authentication/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Follow')
@Controller('follow')
export class FollowController {
    constructor(
        private readonly followService: FollowService,
    ) {}

    @Get('/toggle/:username')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @ApiOperation({
        description: 'Follow/unfollow user'
    })
    toggleFollow(@Param('username') username: string, @GetUser() user: User) {
        return this.followService.followUser(user, username);
    }

    @Get('/followers/:username')
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiOperation({
        description: 'Get user followers'
    })
    getUserFollowers(
        @Param('username') username: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        ) {
        return this.followService.getFollowers(username, { page, limit });
    }

    @Get('/following/:username')
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiOperation({
        description: 'Get users that user follows (following)'
    })
    getUserFollowing(
        @Param('username') username: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        return this.followService.getFollowing(username, { page, limit });
    }
}
