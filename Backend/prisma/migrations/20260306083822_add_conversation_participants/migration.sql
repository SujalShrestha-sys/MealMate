/*
  Warnings:

  - Added the required column `updatedAt` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "_ConversationParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ConversationParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ConversationParticipants_B_index" ON "_ConversationParticipants"("B");

-- AddForeignKey
ALTER TABLE "_ConversationParticipants" ADD CONSTRAINT "_ConversationParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationParticipants" ADD CONSTRAINT "_ConversationParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
