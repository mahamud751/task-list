/*
  Warnings:

  - A unique constraint covering the columns `[taskId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Made the column `taskId` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Task" ALTER COLUMN "taskId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_taskId_key" ON "public"."Task"("taskId");
