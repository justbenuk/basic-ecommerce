import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//convert prisma object into regular js object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

//format errors
export function formatError(error: unknown) {
  if (error instanceof ZodError) {
    const fieldErrors = error.errors.map((e) => e.message);
    return fieldErrors.join(". ");
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const meta = error.meta as { target?: string[] } | undefined;
    const field = meta?.target?.[0] ?? "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message;
    return typeof message === "string"
      ? message
      : JSON.stringify(error.message);
  }
}

// round number to 2 decimal places
export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string");
  }
}

//currency formatter
const currencyFormatter = new Intl.NumberFormat("en-GB", {
  currency: "GBP",
  style: "currency",
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return currencyFormatter.format(amount);
  } else if (typeof amount === "string") {
    return currencyFormatter.format(Number(amount));
  } else {
    return "NaN";
  }
}

//format number
const numberFormatter = new Intl.NumberFormat("en-GB");
export function formatNumber(number: number) {
  return numberFormatter.format(number);
}

//shorten the order id
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

//format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions,
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions,
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions,
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};
