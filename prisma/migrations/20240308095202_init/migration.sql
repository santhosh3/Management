-- CreateTable
CREATE TABLE "UsersOnBoards" (
    "userId" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersOnBoards_pkey" PRIMARY KEY ("userId","boardId")
);

-- AddForeignKey
ALTER TABLE "UsersOnBoards" ADD CONSTRAINT "UsersOnBoards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnBoards" ADD CONSTRAINT "UsersOnBoards_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
