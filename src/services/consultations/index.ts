
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  setDoc,
} from "firebase/firestore";
import { BaseService } from "../core/base-service";
import { 
  AvailabilitySettings, 
  BookingStatus, 
  ConsultationBooking, 
  NewConsultationBooking, 
  TimeSlot 
} from "./types";
import { addDays, format, parse } from "date-fns";

export class ConsultationService extends BaseService {
  private readonly bookingsCollection = "consultationBookings";
  private readonly availabilityCollection = "consultationAvailability";
  private readonly timeSlotsCollection = "consultationTimeSlots";
  private readonly pageSize = 10;

  private convertToBooking(doc: QueryDocumentSnapshot<DocumentData>): ConsultationBooking {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      company: data.company || "",
      date: data.date || "",
      timeSlot: {
        startTime: data.timeSlot.startTime || "",
        endTime: data.timeSlot.endTime || "",
      },
      topic: data.topic || "",
      message: data.message || "",
      status: data.status || "pending",
      createdAt: this.convertTimestampToDate(data.createdAt) || new Date(),
      updatedAt: data.updatedAt ? this.convertTimestampToDate(data.updatedAt) : undefined,
    };
  }

  private convertToAvailabilitySettings(doc: QueryDocumentSnapshot<DocumentData>): AvailabilitySettings {
    const data = doc.data();
    return {
      id: doc.id,
      weekdays: data.weekdays || [1, 2, 3, 4, 5], // Monday to Friday by default
      timeSlots: data.timeSlots || [],
      consultationDuration: data.consultationDuration || 60,
      bufferTime: data.bufferTime || 15,
      excludedDates: data.excludedDates || [],
      maxDaysInAdvance: data.maxDaysInAdvance || 30,
      updatedAt: this.convertTimestampToDate(data.updatedAt) || new Date(),
    };
  }

  private convertToTimeSlot(doc: QueryDocumentSnapshot<DocumentData>): TimeSlot {
    const data = doc.data();
    return {
      id: doc.id,
      startTime: data.startTime || "",
      endTime: data.endTime || "",
      available: data.available ?? true,
      day: data.day || "",
    };
  }

  async getBookings(
    page = 1,
    startAfterDoc: QueryDocumentSnapshot<DocumentData> | null = null,
    status?: BookingStatus,
  ) {
    try {
      let bookingsQuery = query(
        collection(this.db, this.bookingsCollection),
        orderBy("createdAt", "desc"),
      );

      if (status) {
        bookingsQuery = query(bookingsQuery, where("status", "==", status));
      }

      if (startAfterDoc && page > 1) {
        bookingsQuery = query(bookingsQuery, startAfter(startAfterDoc), limit(this.pageSize));
      } else {
        bookingsQuery = query(bookingsQuery, limit(this.pageSize));
      }

      const snapshot = await getDocs(bookingsQuery);
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];

      let hasMore = false;
      if (lastVisible) {
        const nextQuery = query(
          collection(this.db, this.bookingsCollection),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(1),
        );
        const nextSnapshot = await getDocs(nextQuery);
        hasMore = !nextSnapshot.empty;
      }

      const bookings = snapshot.docs.map(this.convertToBooking.bind(this)) as ConsultationBooking[];

      return {
        bookings,
        lastVisible,
        hasMore,
      };
    } catch (error) {
      this.handleError(error, "fetching consultation bookings");
      return { bookings: [], lastVisible: null, hasMore: false };
    }
  }

  async getBookingById(id: string): Promise<ConsultationBooking | null> {
    try {
      const docRef = doc(this.db, this.bookingsCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;
      return this.convertToBooking(docSnap);
    } catch (error) {
      this.handleError(error, "fetching booking by id");
      return null;
    }
  }

  async createBooking(data: NewConsultationBooking): Promise<string> {
    try {
      // First, check if the time slot is available
      const timeSlotQuery = query(
        collection(this.db, this.timeSlotsCollection),
        where("day", "==", data.date),
        where("startTime", "==", data.timeSlot.startTime),
        where("endTime", "==", data.timeSlot.endTime),
        where("available", "==", true)
      );
      
      const timeSlotSnapshot = await getDocs(timeSlotQuery);
      
      if (timeSlotSnapshot.empty) {
        throw new Error("The selected time slot is no longer available.");
      }
      
      // Mark the time slot as unavailable
      const timeSlotDoc = timeSlotSnapshot.docs[0];
      await updateDoc(doc(this.db, this.timeSlotsCollection, timeSlotDoc.id), {
        available: false
      });
      
      // Create the booking
      const docRef = await addDoc(collection(this.db, this.bookingsCollection), {
        ...data,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (error) {
      this.handleError(error, "creating consultation booking");
      throw error;
    }
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
    try {
      const bookingRef = doc(this.db, this.bookingsCollection, id);
      await updateDoc(bookingRef, {
        status,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      this.handleError(error, "updating booking status");
      throw error;
    }
  }

  // Availability Settings
  async getAvailabilitySettings(): Promise<AvailabilitySettings> {
    try {
      const settingsRef = doc(this.db, this.availabilityCollection, "default");
      const docSnap = await getDoc(settingsRef);

      if (!docSnap.exists()) {
        // Create default settings if none exist
        const defaultSettings: Omit<AvailabilitySettings, "id" | "updatedAt"> = {
          weekdays: [1, 2, 3, 4, 5], // Monday to Friday
          timeSlots: [
            { startTime: "09:00", endTime: "12:00" },
            { startTime: "13:00", endTime: "17:00" },
          ],
          consultationDuration: 60, // 1 hour
          bufferTime: 15, // 15 minutes
          excludedDates: [],
          maxDaysInAdvance: 30, // 30 days
        };
        
        await setDoc(settingsRef, {
          ...defaultSettings,
          updatedAt: Timestamp.now(),
        });
        
        return {
          ...defaultSettings,
          id: "default",
          updatedAt: new Date(),
        };
      }

      return this.convertToAvailabilitySettings(docSnap);
    } catch (error) {
      this.handleError(error, "fetching availability settings");
      throw error;
    }
  }

  async updateAvailabilitySettings(settings: Omit<AvailabilitySettings, "id" | "updatedAt">): Promise<void> {
    try {
      const settingsRef = doc(this.db, this.availabilityCollection, "default");
      await setDoc(settingsRef, {
        ...settings,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      this.handleError(error, "updating availability settings");
      throw error;
    }
  }

  // Time Slots
  async generateTimeSlotsForNextDays(days: number = 7): Promise<void> {
    try {
      const settings = await this.getAvailabilitySettings();
      const today = new Date();
      
      // Generate time slots for the next X days
      for (let i = 0; i < days; i++) {
        const currentDate = addDays(today, i);
        const formattedDate = format(currentDate, "yyyy-MM-dd");
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Skip if this day of week is not in the available weekdays
        if (!settings.weekdays.includes(dayOfWeek)) continue;
        
        // Skip if this date is in excluded dates
        if (settings.excludedDates.includes(formattedDate)) continue;
        
        // For each time slot range in settings
        for (const range of settings.timeSlots) {
          const startTime = parse(range.startTime, "HH:mm", new Date());
          const endTime = parse(range.endTime, "HH:mm", new Date());
          const totalMinutes = (endTime.getHours() - startTime.getHours()) * 60 + 
                               (endTime.getMinutes() - startTime.getMinutes());
          
          // Calculate how many slots can fit in this range
          const totalSlotDuration = settings.consultationDuration + settings.bufferTime;
          const numSlots = Math.floor(totalMinutes / totalSlotDuration);
          
          // Create each slot
          for (let j = 0; j < numSlots; j++) {
            const slotStart = new Date(startTime);
            slotStart.setMinutes(startTime.getMinutes() + j * totalSlotDuration);
            
            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotStart.getMinutes() + settings.consultationDuration);
            
            // Check if this slot already exists
            const slotStartStr = format(slotStart, "HH:mm");
            const slotEndStr = format(slotEnd, "HH:mm");
            
            const slotQuery = query(
              collection(this.db, this.timeSlotsCollection),
              where("day", "==", formattedDate),
              where("startTime", "==", slotStartStr),
              where("endTime", "==", slotEndStr)
            );
            
            const existingSlots = await getDocs(slotQuery);
            
            if (existingSlots.empty) {
              // Create the time slot
              await addDoc(collection(this.db, this.timeSlotsCollection), {
                day: formattedDate,
                startTime: slotStartStr,
                endTime: slotEndStr,
                available: true,
              });
            }
          }
        }
      }
    } catch (error) {
      this.handleError(error, "generating time slots");
      throw error;
    }
  }

  async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    try {
      const slotsQuery = query(
        collection(this.db, this.timeSlotsCollection),
        where("day", "==", date),
        where("available", "==", true),
        orderBy("startTime", "asc")
      );
      
      const snapshot = await getDocs(slotsQuery);
      return snapshot.docs.map(this.convertToTimeSlot.bind(this));
    } catch (error) {
      this.handleError(error, "fetching available time slots");
      return [];
    }
  }

  async getBookingsByDate(date: string): Promise<ConsultationBooking[]> {
    try {
      const bookingsQuery = query(
        collection(this.db, this.bookingsCollection),
        where("date", "==", date),
        orderBy("timeSlot.startTime", "asc")
      );
      
      const snapshot = await getDocs(bookingsQuery);
      return snapshot.docs.map(this.convertToBooking.bind(this));
    } catch (error) {
      this.handleError(error, "fetching bookings by date");
      return [];
    }
  }
}

// Export a singleton instance
export const consultationService = new ConsultationService();
