-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_pickupSlotId_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pickupSlotId_fkey" FOREIGN KEY ("pickupSlotId") REFERENCES "PickupSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
