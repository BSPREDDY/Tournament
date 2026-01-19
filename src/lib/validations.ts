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
    playerId1: z.string().min(1, "Player 1 ID is required"),

    player2: z.string().min(2, "Player 2 name is required"),
    playerId2: z.string().min(1, "Player 2 ID is required"),

    player3: z.string().min(2, "Player 3 name is required"),
    playerId3: z.string().min(1, "Player 3 ID is required"),

    player4: z.string().min(2, "Player 4 name is required"),
    playerId4: z.string().min(1, "Player 4 ID is required"),

    iglMail: z.string().email("Invalid email address"),
    iglAlternateMail: z.string().email("Invalid alternate email address"),
    iglNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    iglAlternateNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid alternate phone number"),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type TournamentFormInput = z.infer<typeof tournamentFormSchema>
