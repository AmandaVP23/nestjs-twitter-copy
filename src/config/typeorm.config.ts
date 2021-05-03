import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'nestjs_twitter',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
}
