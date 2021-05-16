import { SuperUser } from './super-user.entity';
import { ChildEntity, Column } from 'typeorm';
@ChildEntity()
export class Admin extends SuperUser {
}