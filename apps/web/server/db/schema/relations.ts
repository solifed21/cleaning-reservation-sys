import { relations } from 'drizzle-orm';
import { users } from './users';
import { cleanerProfiles } from './cleaner-profiles';
import { availableTimes } from './available-times';
import { cleanerServiceAreas } from './cleaner-service-areas';
import { areas, subAreas } from './areas';
import { bookings } from './bookings';
import { messages } from './messages';
import { reviews } from './reviews';
import { notifications } from './notifications';

// Users
export const usersRelations = relations(users, ({ one, many }) => ({
  cleanerProfile: one(cleanerProfiles, {
    fields: [users.id],
    references: [cleanerProfiles.userId],
  }),
  customerBookings: many(bookings, { relationName: 'customer' }),
  cleanerBookings: many(bookings, { relationName: 'cleaner' }),
  sentMessages: many(messages, { relationName: 'sender' }),
  writtenReviews: many(reviews, { relationName: 'author' }),
  receivedReviews: many(reviews, { relationName: 'recipient' }),
  notifications: many(notifications),
}));

// Cleaner Profiles
export const cleanerProfilesRelations = relations(cleanerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [cleanerProfiles.userId],
    references: [users.id],
  }),
  availableTimes: many(availableTimes),
  serviceAreas: many(cleanerServiceAreas),
}));

// Available Times
export const availableTimesRelations = relations(availableTimes, ({ one }) => ({
  profile: one(cleanerProfiles, {
    fields: [availableTimes.profileId],
    references: [cleanerProfiles.id],
  }),
}));

// Cleaner Service Areas
export const cleanerServiceAreasRelations = relations(cleanerServiceAreas, ({ one }) => ({
  profile: one(cleanerProfiles, {
    fields: [cleanerServiceAreas.profileId],
    references: [cleanerProfiles.id],
  }),
  subArea: one(subAreas, {
    fields: [cleanerServiceAreas.subAreaId],
    references: [subAreas.id],
  }),
}));

// Areas
export const areasRelations = relations(areas, ({ many }) => ({
  subAreas: many(subAreas),
}));

export const subAreasRelations = relations(subAreas, ({ one, many }) => ({
  area: one(areas, {
    fields: [subAreas.areaId],
    references: [areas.id],
  }),
  bookings: many(bookings),
  cleanerServices: many(cleanerServiceAreas),
}));

// Bookings
export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(users, {
    fields: [bookings.customerId],
    references: [users.id],
    relationName: 'customer',
  }),
  cleaner: one(users, {
    fields: [bookings.cleanerId],
    references: [users.id],
    relationName: 'cleaner',
  }),
  subArea: one(subAreas, {
    fields: [bookings.subAreaId],
    references: [subAreas.id],
  }),
  messages: many(messages),
  review: one(reviews, {
    fields: [bookings.id],
    references: [reviews.bookingId],
  }),
}));

// Messages
export const messagesRelations = relations(messages, ({ one }) => ({
  booking: one(bookings, {
    fields: [messages.bookingId],
    references: [bookings.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
}));

// Reviews
export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  author: one(users, {
    fields: [reviews.authorId],
    references: [users.id],
    relationName: 'author',
  }),
  recipient: one(users, {
    fields: [reviews.recipientId],
    references: [users.id],
    relationName: 'recipient',
  }),
}));

// Notifications
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
