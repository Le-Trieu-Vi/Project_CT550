/*
  Warnings:

  - You are about to drop the `TaskStatusLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskStatusLog" DROP CONSTRAINT "TaskStatusLog_task_id_fkey";

-- DropForeignKey
ALTER TABLE "TaskStatusLog" DROP CONSTRAINT "TaskStatusLog_user_id_fkey";

-- DropTable
DROP TABLE "TaskStatusLog";

-- CreateTable
CREATE TABLE "task_status_logs" (
    "task_status_log_id" VARCHAR(36) NOT NULL,
    "old_status" "TaskStatus" NOT NULL,
    "new_status" "TaskStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "task_id" VARCHAR(36) NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "task_status_logs_pkey" PRIMARY KEY ("task_status_log_id")
);

-- AddForeignKey
ALTER TABLE "task_status_logs" ADD CONSTRAINT "task_status_logs_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("task_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_status_logs" ADD CONSTRAINT "task_status_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
