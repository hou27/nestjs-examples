# Transaction Interceptor

NestJS + TypeORM 환경에서의
Interceptor를 활용한 Transaction 관련 공통 관심사 분리 예제

> Transaction을 생성하고, commit 혹은 rollback 한 후 release 하는 코드를 분리하여 한 곳에서 관리

## Transaction Interceptor

```Typescript
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const queryRunner: QueryRunner = await this.dbInit();

    req.queryRunnerManager = queryRunner.manager;

    return next.handle().pipe(
      catchError(async (e) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        if (e instanceof HttpException) {
          throw new HttpException(e.message, e.getStatus());
        } else {
          throw new InternalServerErrorException(e.message);
        }
      }),
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),
    );
  }

  private async dbInit(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }
}
```

우선 요청이 들어오면

```Typescript
async intercept(
  context: ExecutionContext,
  next: CallHandler,
): Promise<Observable<any>> {
  const req = context.switchToHttp().getRequest();
  const queryRunner: QueryRunner = await this.dbInit();

  req.queryRunnerManager = queryRunner.manager;

  ...
```

위 부분을 통해 request 객체를 가져오고,

connection을 생성한 후 transaction을 시작하는 공통된 작업을 수행한 후

queryRunner의 manager를 request 객체에 담아둔다.

<br>

그다음 next.handle()을 통해 interceptor가 감싼 메서드를 실행한 후,

<br>

pipe()를 통해 메서드 실행 후의 작업을 정의해두었다.

```Typescript
return next.handle().pipe(
  catchError(async (e) => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();

    if (e instanceof HttpException) {
      throw new HttpException(e.message, e.getStatus());
    } else {
      throw new InternalServerErrorException(e.message);
    }
  }),
  tap(async () => {
    await queryRunner.commitTransaction();
    await queryRunner.release();
  }),
);
```

catchError를 통해 에러가 발생했다면

transaction을 rollback 하고, connection을 release 한 후,

잡은 에러를 던지도록 하였다.

<br>

에러 없이 잘 끝났다면,

transaction을 commit 하고, release 한 후 작업이 종료되도록 하였다.

<br>

자, 이제 이렇게 구현한 Interceptor를 통해 코드를 개선하기 전에

request 객체에 담아둔 query manager를 사용하기 위한

커스텀 데코레이터를 만들도록 할 것이다.

## Transaction Decorator

```Typescript
export const TransactionManager = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.queryRunnerManager;
  },
);
```

request 객체에 접근한 후, 담아뒀던 manager를 반환하도록 하는 간단한 데코레이터를 만들어주었다.
