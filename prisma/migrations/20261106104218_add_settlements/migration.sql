-- CreateTable
CREATE TABLE "platform_settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "settlements" (
    "id" SERIAL NOT NULL,
    "settlement_code" TEXT NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "period_year" INTEGER NOT NULL,
    "period_month" INTEGER NOT NULL,
    "gmv" DECIMAL(14,2) NOT NULL,
    "platform_fee_percent" DECIMAL(5,2) NOT NULL,
    "platform_fee" DECIMAL(14,2) NOT NULL,
    "refund" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "payout" DECIMAL(14,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "due_date" TIMESTAMP(3) NOT NULL,
    "processed_at" TIMESTAMP(3),
    "settled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settlements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settlements_settlement_code_key" ON "settlements"("settlement_code");

-- CreateIndex
CREATE UNIQUE INDEX "settlements_organizer_id_period_year_period_month_key" ON "settlements"("organizer_id", "period_year", "period_month");

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
