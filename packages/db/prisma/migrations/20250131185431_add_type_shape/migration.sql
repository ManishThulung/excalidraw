/*
  Warnings:

  - Added the required column `type` to the `Shape` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShapeType" AS ENUM ('Rect', 'Circle', 'Arrow', 'Text');

-- AlterTable
ALTER TABLE "Shape" ADD COLUMN     "type" "ShapeType" NOT NULL;
