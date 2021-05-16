import { Body, Controller, Get, Header, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { AuthenticationCredentialsDto } from './dto/authentication-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { CustomHeaders } from '../users/custom-headers.enum';
import { GetUser } from './get-user.decorator';
import { User } from '../users/entities/user.entity';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Roles } from '../users/roles.decorator';
import { Role } from '../users/role.enum';
import { RolesGuard } from '../users/roles.guard';

@Controller('authentication')
@ApiTags('Authentication')
export class AuthenticationController {
    constructor(private authenticationService: AuthenticationService) {}

    @Post('/login')
    async login(@Body() authenticationCredentialsDto: AuthenticationCredentialsDto, @Res() res) {
        const loginResult = await this.authenticationService.login(authenticationCredentialsDto);

        res.set(CustomHeaders.AUTHENTICATION, loginResult.token);

        res.send(loginResult);
    }

    @Get('/logout')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    logout(@Req() request, @GetUser() user: User) {
        const authHeader = request.headers.authorization;

        const token = authHeader.split('Bearer ')[1];

        return this.authenticationService.logout(token, user);
    }

    @Post('/recover-password')
    recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
        return this.authenticationService.recoverPassword(recoverPasswordDto);
    }

    @Post('/reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authenticationService.resetPassword(resetPasswordDto);
    }

    @Get('/testing')
    @UseGuards(AuthGuard(), RolesGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth()
    @ApiOperation({
        description: 'Testing admin role'
    })
    testing() {
        return 'ok';
    }
}
