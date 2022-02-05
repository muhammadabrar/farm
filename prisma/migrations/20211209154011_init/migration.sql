-- CreateTable
CREATE TABLE "Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "des" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Flock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flock" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "time" TEXT NOT NULL,
    "Car_no" TEXT NOT NULL,
    "Customer_id" INTEGER NOT NULL,
    "Date" TEXT NOT NULL,
    "Net_weight" INTEGER NOT NULL,
    "Rate" INTEGER NOT NULL,
    "Total_payment" INTEGER NOT NULL,
    "advance" INTEGER NOT NULL,
    "received_payment" INTEGER NOT NULL,
    "Net_received" INTEGER NOT NULL,
    "Net_Amount" INTEGER NOT NULL,
    "Net_Balance" INTEGER NOT NULL,
    "Balance" INTEGER NOT NULL,
    "broker" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "f_weight" INTEGER NOT NULL,
    "l_weight" INTEGER NOT NULL,
    "flock_id" INTEGER NOT NULL,
    CONSTRAINT "Order_Customer_id_fkey" FOREIGN KEY ("Customer_id") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_flock_id_fkey" FOREIGN KEY ("flock_id") REFERENCES "Flock" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
