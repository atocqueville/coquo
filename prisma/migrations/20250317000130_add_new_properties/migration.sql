/*
  Warnings:

  - Added the required column `cookTime` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prepTime` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servings` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "picture" TEXT,
    "ingredients" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "prepTime" INTEGER NOT NULL,
    "cookTime" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Recipe" ("created_at", "id", "ingredients", "picture", "title", "updated_at", "userId") SELECT "created_at", "id", "ingredients", "picture", "title", "updated_at", "userId" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
