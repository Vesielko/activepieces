import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAiProvider1725927553607 implements MigrationInterface {
    name = 'AddAiProvider1725927553607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ai_provider" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "platformId" character varying NOT NULL,
                "config" json NOT NULL,
                "baseUrl" character varying NOT NULL,
                "provider" character varying NOT NULL,
                CONSTRAINT "REL_04619a92ba6ba054cd41335a67" UNIQUE ("platformId", "provider"),
                CONSTRAINT "PK_1046c2cb42f99614e1c7873744b" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            CREATE UNIQUE INDEX "idx_ai_provider_platform_id_provider" ON "ai_provider" ("platformId", "provider")
        `)
        await queryRunner.query(`
            ALTER TABLE "ai_provider"
            ADD CONSTRAINT "fk_ai_provider_platform_id" FOREIGN KEY ("platformId") REFERENCES "platform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
        await queryRunner.query(`ALTER TABLE "project_plan" ADD COLUMN "aiTokens" integer DEFAULT 1000;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ai_provider" DROP CONSTRAINT "fk_ai_provider_platform_id"
        `)
        await queryRunner.query(`
            DROP INDEX "idx_ai_provider_platform_id_provider"
        `)
        await queryRunner.query(`
            DROP TABLE "ai_provider"
        `)
        await queryRunner.query(`ALTER TABLE "project_plan" DROP COLUMN "aiTokens";`);
    }

}