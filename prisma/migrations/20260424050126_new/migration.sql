-- CreateEnum
CREATE TYPE "BusinessOperatedBy" AS ENUM ('HOME_BASED', 'LOCATION_BASED', 'MOBILE_BASED', 'ONSITE_BASED');

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "business_name" VARCHAR(255),
    "business_cover_photo" VARCHAR(255),
    "business_description" VARCHAR(255),
    "business_note" TEXT,
    "category_id" TEXT,
    "sub_category_id" TEXT,
    "OPERATED_BY" "BusinessOperatedBy",
    "specialties" VARCHAR(255),
    "service_area" VARCHAR(255),
    "portfolio_files" TEXT[],

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "package_name" VARCHAR(255),
    "package_description" TEXT,
    "package_image" VARCHAR(255),
    "side_choices" TEXT,
    "notes" TEXT,
    "service_price" DECIMAL(10,2) DEFAULT 0.0,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "day_name" VARCHAR(50),
    "start_time" VARCHAR(10),
    "end_time" VARCHAR(10),
    "intra_service_interval_hours" INTEGER DEFAULT 0,
    "intra_service_interval_minutes" INTEGER DEFAULT 0,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "service_sub_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "days" ADD CONSTRAINT "days_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
