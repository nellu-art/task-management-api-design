import { Person, PersonId } from './person.entity';

export abstract class IPersonRepository {
  abstract findAll(): Promise<Person[]>;
  abstract findById(id: PersonId): Promise<Person | null>;
  abstract create(person: Person): Promise<Person>;
  abstract update(id: PersonId, person: Partial<Person>): Promise<Person>;
  abstract delete(id: PersonId): Promise<boolean>;
}

export const PERSON_REPOSITORY = Symbol('PERSON_REPOSITORY');
