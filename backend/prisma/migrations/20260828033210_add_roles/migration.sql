-- DropForeignKey
ALTER TABLE "ticket_types" DROP CONSTRAINT "ticket_types_event_id_fkey";

-- AddForeignKey
ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
