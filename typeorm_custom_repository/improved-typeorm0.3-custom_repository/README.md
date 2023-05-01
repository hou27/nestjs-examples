# Improved Custom Repository Example with TypeORM after 0.3 ver

> 본 예제는 NestJS와 TypeORM 0.3 버전을 사용하며 PostgreSQL을 데이터베이스로 사용하여 간단하게 TypeORM Custom Repository를 구현하는 예제입니다.

## Pre-requisites

- Yarn
- Node.js
- PostgreSQL
- Nest CLI(Optional)

```bash
yarn add @nestjs/typeorm typeorm pg

yarn add @nestjs/config
```

## TypeORM Custom Repository Example

```typescript
@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async customMethod(id: number): Promise<User> {
    return await this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOneOrFail();
  }
}
```

위 코드와 같이 TypeORM 0.3.x 버전에서도 TypeORM이 제공하는 Repository를 상속받아 Custom Repository를 구현할 수 있습니다.

### 핵심 코드

```typescript
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
```

중요한 생성자 부분입니다.  
TypeORM 0.3.x 버전에서는 @EntityRepository 데코레이터를 사용하지 않고,  
Repository 생성자의 인자로 EntityManager를 전달해야 합니다.

```typescript
export declare class Repository<Entity extends ObjectLiteral> {
    ...
    /**
     * Entity metadata of the entity current repository manages.
     */
    get metadata(): import("..").EntityMetadata;
    constructor(target: EntityTarget<Entity>, manager: EntityManager, queryRunner?: QueryRunner);
    ...
}
```

위 코드에서 확인한 정보를 통해

UserRepository는 부모 클래스인 Repository의 생성자를 User Entity와 EntityManager와 함께 호출하여
User Entity를 관리하는 Repository를 생성하고, 이를 통해 User Entity에 대한 Custom Repository를 구현할 수 있었습니다.
