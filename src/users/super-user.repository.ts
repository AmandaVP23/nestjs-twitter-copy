import { EntityRepository, Repository } from 'typeorm';
import { AuthenticationCredentialsDto } from '../authentication/dto/authentication-credentials.dto';
import { SuperUser } from './entities/super-user.entity';

@EntityRepository(SuperUser)
export class SuperUserRepository extends Repository<SuperUser> {
    async validateUserPassword(authCredentialsDto: AuthenticationCredentialsDto): Promise<SuperUser> {
        const { emailOrUsername, password } = authCredentialsDto;

        // const user = await this.findOne({ email });
        const user = await this.createQueryBuilder('user')
            .where('user.email = :email', { email: emailOrUsername })
            .orWhere('user.username = :username', { username: emailOrUsername })
            .getOne();

        if (user && await user.validatePassword(password)) {
            return user;
        }

        return null;
    }
}