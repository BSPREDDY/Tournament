import { pgTable, uuid, varchar, pgEnum, uniqueIndex, timestamp, primaryKey, boolean } from "drizzle-orm/pg-core"

/* ---------------- ENUM ---------------- */
export const UserRole = pgEnum("user_role", ["admin", "user"])

/* ---------------- USERS TABLE ---------------- */
export const UserTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),

    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),

    phoneNumber: varchar("phone_number", { length: 15 }).notNull(),

    role: UserRole("role").default("user").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIndex: uniqueIndex("users_email_unique").on(table.email),
    phoneIndex: uniqueIndex("users_phone_unique").on(table.phoneNumber),
  }),
)

/* ---------------- FORM DATA TABLE ---------------- */
export const FormDataTable = pgTable(
  "form_data",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id").references(() => UserTable.id, { onDelete: "cascade" }),
    guestUserId: varchar("guest_user_id", { length: 255 }),

    teamName: varchar("team_name", { length: 255 }).notNull(),
    iglName: varchar("igl_name", { length: 255 }).notNull(),

    player1: varchar("player_1", { length: 255 }).notNull(),
    playerId1: varchar("player_id_1", { length: 100 }).notNull(),

    player2: varchar("player_2", { length: 255 }).notNull(),
    playerId2: varchar("player_id_2", { length: 100 }).notNull(),

    player3: varchar("player_3", { length: 255 }),
    playerId3: varchar("player_id_3", { length: 100 }),

    player4: varchar("player_4", { length: 255 }),
    playerId4: varchar("player_id_4", { length: 100 }),

    iglMail: varchar("igl_mail", { length: 255 }).notNull(),
    iglAlternateMail: varchar("igl_alternate_mail", { length: 255 }),

    iglNumber: varchar("igl_number", { length: 15 }).notNull(),
    iglAlternateNumber: varchar("igl_alternate_number", { length: 15 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Required unique indexes
    iglMailIndex: uniqueIndex("form_data_igl_mail_unique").on(table.iglMail),
    iglNumberIndex: uniqueIndex("form_data_igl_number_unique").on(table.iglNumber),
  }),
)

/* ---------------- SESSIONS TABLE ---------------- */
export const SessionTable = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .references(() => UserTable.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

/* ---------------- VERIFICATION TOKENS ---------------- */
export const VerificationTokenTable = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.identifier, table.token],
    }),
  }),
)

/* ---------------- PASSWORD RESET TOKENS ---------------- */
export const PasswordResetTokenTable = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .references(() => UserTable.id, { onDelete: "cascade" })
    .notNull(),

  token: varchar("token", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
})

/* ---------------- FORM CONFIG TABLE ---------------- */
export const FormConfigTable = pgTable("form_config", {
  id: uuid("id").primaryKey().defaultRandom(),

  fields: varchar("fields", { length: 2000 }).notNull().default("[]"),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

/* ---------------- FORM STATUS TABLE ---------------- */
export const FormStatusTable = pgTable("form_status", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id")
    .references(() => FormDataTable.id, { onDelete: "cascade" })
    .notNull()
    .unique(),

  isEnabled: boolean("is_enabled").default(true).notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

/* ---------------- REGISTRATION CONFIG TABLE ---------------- */
export const RegistrationConfigTable = pgTable("registration_config", {
  id: uuid("id").primaryKey().defaultRandom(),

  registrationStopAt: timestamp("registration_stop_at"),
  isRegistrationOpen: boolean("is_registration_open").default(true).notNull(),
  maxTeams: varchar("max_teams", { length: 10 }).default("999").notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

/* ---------------- BGMI SCHEDULE TABLE ---------------- */
export const BgmiScheduleTable = pgTable("bgmi_schedule", {
  id: uuid("id").primaryKey().defaultRandom(),

  date: varchar("date", { length: 50 }).notNull(),
  time: varchar("time", { length: 500 }).notNull(),
  maps: varchar("maps", { length: 500 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

/* ---------------- USER CONTACT FORM TABLE ---------------- */
export const UserContactFormTable = pgTable("user_contact_forms", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .references(() => UserTable.id, { onDelete: "cascade" })
    .notNull(),

  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  message: varchar("message", { length: 5000 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
})

/* ---------------- MATCHES TABLE (25 teams per match) ---------------- */
export const MatchesTable = pgTable("matches", {
  id: uuid("id").primaryKey().defaultRandom(),

  matchNumber: varchar("match_number", { length: 50 }).notNull(),
  roomId: varchar("room_id", { length: 255 }).notNull().unique(),
  roomPassword: varchar("room_password", { length: 255 }).notNull(),

  maxTeams: varchar("max_teams", { length: 10 }).default("25").notNull(),
  registeredTeams: varchar("registered_teams", { length: 10 }).default("0").notNull(),

  isLocked: boolean("is_locked").default(false).notNull(),
  visibleToAll: boolean("visible_to_all").default(false).notNull(), // false = registered teams only, true = everyone
  passwordShareTime: timestamp("password_share_time"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

/* ---------------- MATCH TEAMS TABLE (Links teams to matches) ---------------- */
export const MatchTeamsTable = pgTable("match_teams", {
  id: uuid("id").primaryKey().defaultRandom(),

  matchId: uuid("match_id")
    .references(() => MatchesTable.id, { onDelete: "cascade" })
    .notNull(),

  formDataId: uuid("form_data_id")
    .references(() => FormDataTable.id, { onDelete: "cascade" })
    .notNull(),

  teamSlot: varchar("team_slot", { length: 10 }).notNull(),
  status: varchar("status", { length: 50 }).default("registered").notNull(), // registered, playing, finished

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

/* ---------------- TYPES ---------------- */
export type User = typeof UserTable.$inferSelect
export type FormData = typeof FormDataTable.$inferSelect
export type Session = typeof SessionTable.$inferSelect
export type VerificationToken = typeof VerificationTokenTable.$inferSelect
export type PasswordResetToken = typeof PasswordResetTokenTable.$inferSelect
export type FormConfig = typeof FormConfigTable.$inferSelect
export type FormStatus = typeof FormStatusTable.$inferSelect
export type RegistrationConfig = typeof RegistrationConfigTable.$inferSelect
export type BgmiSchedule = typeof BgmiScheduleTable.$inferSelect
export type UserContactForm = typeof UserContactFormTable.$inferSelect
export type Match = typeof MatchesTable.$inferSelect
export type MatchTeam = typeof MatchTeamsTable.$inferSelect

/* ---------------- EXPORT SCHEMA ---------------- */
export const dbSchema = {
  users: UserTable,
  formData: FormDataTable,
  sessions: SessionTable,
  verificationTokens: VerificationTokenTable,
  passwordResetTokens: PasswordResetTokenTable,
  formConfig: FormConfigTable,
  formStatus: FormStatusTable,
  registrationConfig: RegistrationConfigTable,
  bgmiSchedule: BgmiScheduleTable,
  userContactForms: UserContactFormTable,
  matches: MatchesTable,
  matchTeams: MatchTeamsTable,
} as const
