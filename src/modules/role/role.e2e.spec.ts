import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma.service';
import { Role, User } from '@prisma/client';
import { useContainer } from 'class-validator';

describe('Cats (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let role: Role;
  let user: User;
  const catShape = expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
    breed: expect.any(String),
    age: expect.any(Number),
    ownerId: expect.any(String),
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    user = await prisma.user.create({
      data: {
        firstName: 'Owner1',
        lastName: "asdasd",
        email: "yogen",
      },
    });

    role = await prisma.role.create({
      data: {
        title: 'Cat1',
        slug: 'Breed1',
        addedById: user.id
      },
    });

  });

  afterAll(async () => {
    await prisma.truncate();
    await prisma.resetSequences();
    await prisma.$disconnect();
    await app.close();
  });

  afterEach(async () => {
    // TODO: use transactions and transaction rollback once prisma supports it
  });

  describe('GET /cats', () => {
    it('returns a list of cats', async () => {
      const { status, body } = await request(app.getHttpServer()).get('/cats');

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([catShape]));
    });

    // describe('with name filter', () => {
    //   it('returns a filtered list of cats', async () => {
    //     const { status, body } = await request(app.getHttpServer()).get(
    //       `/cats?name=${cat.name}`,
    //     );

    //     expect(status).toBe(200);
    //     expect(body).toStrictEqual(expect.arrayContaining([catShape]));
    //     expect(body).toHaveLength(1);
    //   });
    // });
  });

  // describe('GET /cats/:id', () => {
  //   it('returns a cat', async () => {
  //     const { status, body } = await request(app.getHttpServer()).get(
  //       `/cats/${cat.id}`,
  //     );

  //     expect(status).toBe(200);
  //     expect(body).toStrictEqual(catShape);
  //   });
  // });

  describe('POST /cats', () => {
    it('creates a cat', async () => {
      const beforeCount = await prisma.role.count();

      const { status, body } = await request(app.getHttpServer())
        .post('/cats')
        .send({
          name: 'TestCat',
          breed: 'TestBreed',
          age: 5
        });

      const afterCount = await prisma.role.count();

      expect(status).toBe(201);
      expect(body).toStrictEqual(catShape);
      expect(afterCount - beforeCount).toBe(1);
    });

    describe('with non existing owner', () => {
      it('returns HTTP status 400', async () => {
        const beforeCount = await prisma.role.count();

        const { status, body } = await request(app.getHttpServer())
          .post('/cats')
          .send({
            name: 'TestCat',
            breed: 'TestBreed',
            age: 5,
            ownerId: 'non-existing',
          });

        const afterCount = await prisma.role.count();

        expect(status).toBe(400);
        expect(afterCount - beforeCount).toBe(0);
      });
    });
  });
  describe('PATCH /cats/:id', () => {
    it('updates a cat', async () => {
      const newOwner = await prisma.role.create({
        data: {
          slug: 'NewOwner',
          title: "some",
        },
      });

      // const { status, body } = await request(app.getHttpServer())
      //   .patch(`/cats/${cat.id}`)
      //   .send({
      //     name: 'ModifiedTestCat',
      //     age: 2,
      //     ownerId: newOwner.id,
      //   });

      // expect(status).toBe(200);
      // expect(body).toStrictEqual(catShape);
    });
  });

  // describe('DELETE /cats/:id', () => {
  //   it('deletes a cat', async () => {
  //     const { status, body } = await request(app.getHttpServer()).delete(
  //       `/cats/${cat.id}`,
  //     );

  //     expect(status).toBe(200);
  //     expect(body).toStrictEqual({ deleted: true });
  //   });
  // });
});