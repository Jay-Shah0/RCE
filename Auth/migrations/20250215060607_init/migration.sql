-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "mongouserid" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "token" TEXT,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repl" (
    "id" TEXT NOT NULL,
    "mongoreplid" TEXT NOT NULL,
    "replname" TEXT NOT NULL,
    "repltemplate" TEXT NOT NULL,
    "ispublic" BOOLEAN NOT NULL,
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "Repl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_mongouserid_key" ON "User"("mongouserid");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Repl_id_key" ON "Repl"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Repl_mongoreplid_key" ON "Repl"("mongoreplid");

-- CreateIndex
CREATE INDEX "Repl_userid_idx" ON "Repl"("userid");

-- AddForeignKey
ALTER TABLE "Repl" ADD CONSTRAINT "Repl_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
