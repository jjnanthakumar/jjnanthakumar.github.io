
import { TTimestamp } from "@/services/firebase";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type TimeSlot = {
  id: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  available: boolean;
  day: string; // YYYY-MM-DD format
};

export type ConsultationBooking = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  date: string; // YYYY-MM-DD format
  timeSlot: {
    startTime: string; // ISO string
    endTime: string; // ISO string
  };
  topic: string;
  message?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt?: Date;
};

export type NewConsultationBooking = Omit<
  ConsultationBooking,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export type AvailabilitySettings = {
  id: string;
  weekdays: number[]; // 0-6, where 0 is Sunday
  timeSlots: {
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
  }[];
  consultationDuration: number; // in minutes
  bufferTime: number; // in minutes
  excludedDates: string[]; // YYYY-MM-DD format
  maxDaysInAdvance: number;
  updatedAt: Date;
};
