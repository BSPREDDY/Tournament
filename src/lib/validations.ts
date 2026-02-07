import { z } from "zod"

export const registerSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

export const tournamentFormSchema = z.object({
    teamName: z.string().min(2, "Team name must be at least 2 characters"),
    iglName: z.string().min(2, "IGL name must be at least 2 characters"),

    player1: z.string().min(2, "Player 1 name is required"),
    playerId1: z.string().regex(/^\d{11}$/, "Player 1 ID must be exactly 11 digits"),

    player2: z.string().min(2, "Player 2 name is required"),
    playerId2: z.string().regex(/^\d{11}$/, "Player 2 ID must be exactly 11 digits"),

    player3: z.string().optional(),
    playerId3: z.string().optional().refine((val) => !val || /^\d{11}$/.test(val), "Player 3 ID must be exactly 11 digits if provided"),

    player4: z.string().optional(),
    playerId4: z.string().optional().refine((val) => !val || /^\d{11}$/.test(val), "Player 4 ID must be exactly 11 digits if provided"),

    iglMail: z.string().email("IGL email must be a valid email address"),
    iglAlternateMail: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, "Alternate email must be a valid email address if provided"),
    iglNumber: z.string().regex(/^\d{10}$/, "IGL phone number must be exactly 10 digits"),
    iglAlternateNumber: z.string().optional().refine((val) => !val || /^\d{10}$/.test(val), "Alternate phone number must be exactly 10 digits if provided"),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type TournamentFormInput = z.infer<typeof tournamentFormSchema>
