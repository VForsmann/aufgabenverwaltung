import { Entity } from "./entity";
import {UpdateWriteOpResult, DeleteWriteOpResultObject} from 'mongodb';

export default interface genericDao<T extends Entity> {
    create: (entity: Partial<T>) => Promise<T>,
    findAll: (entityFiler: Partial<T>) => Promise<T[]>,
    findOne: (entityFilter: Partial<T>) => Promise<T>,
    update: (entity: Partial<T>) => Promise<UpdateWriteOpResult>,
    delete: (id: string) => Promise<DeleteWriteOpResultObject>
}