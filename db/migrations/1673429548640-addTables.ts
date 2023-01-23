import { MigrationInterface, QueryRunner } from "typeorm";

export class addTables1673429548640 implements MigrationInterface {
    name = 'addTables1673429548640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "meeting" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "zoomUrl" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "contact_info" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "phone" integer, "userId" integer NOT NULL, CONSTRAINT "REL_b075c73d917a898757645dc492" UNIQUE ("userId"))`);
        await queryRunner.query(`CREATE TABLE "user_meetings_meeting" ("userId" integer NOT NULL, "meetingId" integer NOT NULL, PRIMARY KEY ("userId", "meetingId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f21b8f4c37735e3e805d2cfd1b" ON "user_meetings_meeting" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c7917229b55c06030de3a25e12" ON "user_meetings_meeting" ("meetingId") `);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "hashRefresh" varchar, "role" varchar NOT NULL DEFAULT ('User'), "managerId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "username", "email", "password", "hashRefresh", "role") SELECT "id", "username", "email", "password", "hashRefresh", "role" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "userId" integer, CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "name", "userId") SELECT "id", "name", "userId" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "hashRefresh" varchar, "role" varchar NOT NULL DEFAULT ('User'), "managerId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "FK_df69481de1f438f2082e4d54749" FOREIGN KEY ("managerId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "username", "email", "password", "hashRefresh", "role", "managerId") SELECT "id", "username", "email", "password", "hashRefresh", "role", "managerId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_contact_info" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "phone" integer, "userId" integer NOT NULL, CONSTRAINT "REL_b075c73d917a898757645dc492" UNIQUE ("userId"), CONSTRAINT "FK_b075c73d917a898757645dc4924" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_contact_info"("id", "phone", "userId") SELECT "id", "phone", "userId" FROM "contact_info"`);
        await queryRunner.query(`DROP TABLE "contact_info"`);
        await queryRunner.query(`ALTER TABLE "temporary_contact_info" RENAME TO "contact_info"`);
        await queryRunner.query(`DROP INDEX "IDX_f21b8f4c37735e3e805d2cfd1b"`);
        await queryRunner.query(`DROP INDEX "IDX_c7917229b55c06030de3a25e12"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_meetings_meeting" ("userId" integer NOT NULL, "meetingId" integer NOT NULL, CONSTRAINT "FK_f21b8f4c37735e3e805d2cfd1bd" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_c7917229b55c06030de3a25e12d" FOREIGN KEY ("meetingId") REFERENCES "meeting" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "meetingId"))`);
        await queryRunner.query(`INSERT INTO "temporary_user_meetings_meeting"("userId", "meetingId") SELECT "userId", "meetingId" FROM "user_meetings_meeting"`);
        await queryRunner.query(`DROP TABLE "user_meetings_meeting"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_meetings_meeting" RENAME TO "user_meetings_meeting"`);
        await queryRunner.query(`CREATE INDEX "IDX_f21b8f4c37735e3e805d2cfd1b" ON "user_meetings_meeting" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c7917229b55c06030de3a25e12" ON "user_meetings_meeting" ("meetingId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_c7917229b55c06030de3a25e12"`);
        await queryRunner.query(`DROP INDEX "IDX_f21b8f4c37735e3e805d2cfd1b"`);
        await queryRunner.query(`ALTER TABLE "user_meetings_meeting" RENAME TO "temporary_user_meetings_meeting"`);
        await queryRunner.query(`CREATE TABLE "user_meetings_meeting" ("userId" integer NOT NULL, "meetingId" integer NOT NULL, PRIMARY KEY ("userId", "meetingId"))`);
        await queryRunner.query(`INSERT INTO "user_meetings_meeting"("userId", "meetingId") SELECT "userId", "meetingId" FROM "temporary_user_meetings_meeting"`);
        await queryRunner.query(`DROP TABLE "temporary_user_meetings_meeting"`);
        await queryRunner.query(`CREATE INDEX "IDX_c7917229b55c06030de3a25e12" ON "user_meetings_meeting" ("meetingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f21b8f4c37735e3e805d2cfd1b" ON "user_meetings_meeting" ("userId") `);
        await queryRunner.query(`ALTER TABLE "contact_info" RENAME TO "temporary_contact_info"`);
        await queryRunner.query(`CREATE TABLE "contact_info" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "phone" integer, "userId" integer NOT NULL, CONSTRAINT "REL_b075c73d917a898757645dc492" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "contact_info"("id", "phone", "userId") SELECT "id", "phone", "userId" FROM "temporary_contact_info"`);
        await queryRunner.query(`DROP TABLE "temporary_contact_info"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "hashRefresh" varchar, "role" varchar NOT NULL DEFAULT ('User'), "managerId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "username", "email", "password", "hashRefresh", "role", "managerId") SELECT "id", "username", "email", "password", "hashRefresh", "role", "managerId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "task"("id", "name", "userId") SELECT "id", "name", "userId" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "hashRefresh" varchar, "role" varchar NOT NULL DEFAULT ('User'), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "username", "email", "password", "hashRefresh", "role") SELECT "id", "username", "email", "password", "hashRefresh", "role" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`DROP INDEX "IDX_c7917229b55c06030de3a25e12"`);
        await queryRunner.query(`DROP INDEX "IDX_f21b8f4c37735e3e805d2cfd1b"`);
        await queryRunner.query(`DROP TABLE "user_meetings_meeting"`);
        await queryRunner.query(`DROP TABLE "contact_info"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "meeting"`);
    }

}
