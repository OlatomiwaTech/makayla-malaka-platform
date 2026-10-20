CREATE TABLE "PasswordResetOtp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetOtp_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PasswordResetOtp_userId_key" ON "PasswordResetOtp"("userId");
CREATE INDEX "PasswordResetOtp_expiresAt_idx" ON "PasswordResetOtp"("expiresAt");

ALTER TABLE "PasswordResetOtp"
ADD CONSTRAINT "PasswordResetOtp_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
