//           richColors: true,
//         })
//         setFormData({
//           teamName: "",
//           iglName: "",
//           player1: "",
//           playerId1: "",
//           player2: "",
//           playerId2: "",
//           player3: "",
//           playerId3: "",
//           player4: "",
//           playerId4: "",
//           iglMail: "",
//           iglAlternateMail: "",
//           iglNumber: "",
//           iglAlternateNumber: "",
//         })
//         setIsSubmitted(true)
//       } else {
//         toast.error(data.error || "Form submission failed")
//       }
//     } catch (error) {
//       toast.error("An error occurred")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked
//       setFormData((prev: any) => ({ ...prev, [name]: checked }))
//     } else {
//       setFormData((prev: any) => ({ ...prev, [name]: value }))
//     }
//   }

//   if (registrationClosed) {
//     return (
//       <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
//         <FormNavbar />
//         <div className="pt-20 sm:pt-24 md:pt-8 py-6 sm:py-8 md:py-12 flex-1 flex items-center justify-center">
//           <div className="max-w-md mx-auto px-3 sm:px-4">
//             <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 sm:p-8 text-center space-y-4">
//               <h1 className="text-2xl sm:text-3xl font-bold text-red-500">Registration Closed</h1>
//               <p className="text-sm sm:text-base text-muted-foreground">
//                 {closureReason || "Registrations for the tournament are currently closed."}
//               </p>
//               {maxTeams && currentTeams && (
//                 <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 my-4">
//                   <p className="text-xs sm:text-sm font-semibold text-foreground">Teams Capacity</p>
//                   <p className="text-lg sm:text-xl font-bold text-primary mt-1">{currentTeams} / {maxTeams}</p>
//                 </div>
//               )}
//               <p className="text-xs sm:text-sm text-muted-foreground">
//                 Please contact the administrator for more information.
//               </p>
//               <Link href="/dashboard">
//                 <Button className="w-full mt-4">Go Back to Dashboard</Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (isSubmitted) {
//     return (
//       <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
//         <FormNavbar />
//         <div className="pt-20 sm:pt-24 md:pt-8 py-6 sm:py-8 md:py-12 flex-1 flex items-center justify-center">
//           <div className="max-w-md mx-auto px-3 sm:px-4">
//             <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-6 sm:p-8 text-center space-y-6">
//               <div className="flex justify-center">
//                 <Trophy className="w-16 h-16 text-green-500" />
//               </div>
//               <div className="space-y-3">
//                 <h1 className="text-2xl sm:text-3xl font-bold text-green-500">Registration Successful!</h1>
//                 <p className="text-sm sm:text-base text-foreground font-medium">Your team has been successfully registered for the tournament.</p>
//               </div>
//               <div className="bg-card/50 rounded-lg p-4 space-y-2">
//                 <p className="text-xs sm:text-sm text-muted-foreground">Want to check tournament schedules, registered teams count, and more?</p>
//                 <p className="text-sm font-semibold text-foreground">Please login to your account to access these features.</p>
//               </div>
//               <div className="flex flex-col gap-2 w-full">
//                 <Link href="/auth/user/login" className="w-full">
//                   <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg shadow-lg shadow-primary/30 transition-all duration-300 font-bold">
//                     Continue to Login
//                   </Button>
//                 </Link>
//                 <Link href="/" className="w-full">
//                   <Button variant="outline" className="w-full hover:bg-primary/5">
//                     Back to Home
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
//       <FormNavbar />
//       <div className="sm:pt-24 md:pt-5 py-6 sm:py-8 md:py-12 flex-1 mt-20">
//         <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
//           <div className="flex flex-col gap-4 mb-6 sm:mb-8 items-center">
//             <div>
//               <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">Tournament Registration Form</h1>
//               <p className="mt-2 text-center sm:text-sm text-muted-foreground">Fill out all the details for your team registration</p>
//             </div>
//           </div>
//           {registrationDeadline && (
//             <p className="text-lg sm:text-xs md:text-lg font-bold text-primary mb-3 sm:mb-4 text-center">
//               Deadline: <span className="text-pretty/20 text-lg">{new Date(registrationDeadline).toLocaleString()}</span>
//             </p>
//           )}
//           <form onSubmit={handleSubmit} className="card-glow rounded-xl border p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
//             <div className="border-b pb-4 sm:pb-6">
//               <div className="mb-4 sm:mb-6 text-center">
//                 <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Team Information</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//                 <div>
//                   <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">Team Name *</label>
//                   <Input
//                     name="teamName"
//                     value={formData.teamName}
//                     onChange={handleChange}
//                     required
//                     placeholder="Enter team name"
//                     className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm ${errors.teamName ? "border-red-500 focus:border-red-500" : ""}`}
//                   />
//                   {errors.teamName && <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">IGL (In-Game Leader) Name *</label>
//                   <Input
//                     name="iglName"
//                     value={formData.iglName}
//                     onChange={handleChange}
//                     required
//                     placeholder="Enter IGL name"
//                     className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm ${errors.iglName ? "border-red-500 focus:border-red-500" : ""}`}
//                   />
//                   {errors.iglName && <p className="text-red-500 text-xs mt-1">{errors.iglName}</p>}
//                 </div>
//               </div>
//             </div>

//             <div className="border-b pb-4 sm:pb-6">
//               <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Player Details</h2>
//               <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Player 1 & 2 are mandatory. Player 3 & 4 are optional.</p>
//               {[1, 2, 3, 4].map((num) => {
//                 const isMandatory = num <= 2
//                 const playerNameKey = `player${num}` as keyof typeof formData
//                 const playerIdKey = `playerId${num}` as keyof typeof formData
//                 return (
//                   <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
//                     <div>
//                       <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
//                         Player {num} In-Game Name {isMandatory ? "*" : "(Optional)"}
//                       </label>
//                       <Input
//                         name={`player${num}`}
//                         value={formData[playerNameKey]}
//                         onChange={handleChange}
//                         required={isMandatory}
//                         placeholder={`Enter player ${num} name`}
//                         className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm ${errors[`player${num}`] ? "border-red-500 focus:border-red-500" : ""}`}
//                       />
//                       {errors[`player${num}`] && <p className="text-red-500 text-xs mt-1">{errors[`player${num}`]}</p>}
//                     </div>
//                     <div>
//                       <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
//                         Player {num} ID {isMandatory ? "*" : "(Optional)"}{/* {!isMandatory && <span className="text-xs text-muted-foreground">(11 digits)</span>} */}
//                       </label>
//                       <Input
//                         name={`playerId${num}`}
//                         value={formData[playerIdKey]}
//                         onChange={handleChange}
//                         required={isMandatory}
//                         placeholder={`Enter ${isMandatory ? "" : ""}11 digit ID`}
//                         className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm ${errors[`playerId${num}`] ? "border-red-500 focus:border-red-500" : ""}`}
//                       />
//                       {errors[`playerId${num}`] && <p className="text-red-500 text-xs mt-1">{errors[`playerId${num}`]}</p>}
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>

//             <div className="border-b pb-4 sm:pb-6">
//               <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Contact Information</h2>
//               <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
//                 Primary email & phone are mandatory. Alternate details are optional.
//               </p>
//               <div className="space-y-3 sm:space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-foreground mb-2">IGL Email *</label>
//                     <Input
//                       name="iglMail"
//                       type="email"
//                       value={formData.iglMail}
//                       onChange={handleChange}
//                       required
//                       placeholder="Enter IGL email"
//                       className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 ${errors.iglMail ? "border-red-500 focus:border-red-500" : ""}`}
//                     />
//                     {errors.iglMail && <p className="text-red-500 text-xs mt-1">{errors.iglMail}</p>}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-foreground mb-2">Alternate Email (Optional)</label>
//                     <Input
//                       name="iglAlternateMail"
//                       type="email"
//                       value={formData.iglAlternateMail}
//                       onChange={handleChange}
//                       placeholder="Enter alternate email"
//                       className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 ${errors.iglAlternateMail ? "border-red-500 focus:border-red-500" : ""}`}
//                     />
//                     {errors.iglAlternateMail && <p className="text-red-500 text-xs mt-1">{errors.iglAlternateMail}</p>}
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-foreground mb-2">IGL Phone Number * <span className="text-xs text-muted-foreground">(10 digits)</span></label>
//                     <Input
//                       name="iglNumber"
//                       value={formData.iglNumber}
//                       onChange={handleChange}
//                       required
//                       placeholder="Enter 10 digit phone number"
//                       className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 ${errors.iglNumber ? "border-red-500 focus:border-red-500" : ""}`}
//                     />
//                     {errors.iglNumber && <p className="text-red-500 text-xs mt-1">{errors.iglNumber}</p>}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-foreground mb-2">
//                       Alternate Phone Number (Optional)
//                     </label>
//                     <Input
//                       name="iglAlternateNumber"
//                       value={formData.iglAlternateNumber}
//                       onChange={handleChange}
//                       placeholder="Enter Alternate 10 digit phone number"
//                       className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 ${errors.iglAlternateNumber ? "border-red-500 focus:border-red-500" : ""}`}
//                     />
//                     {errors.iglAlternateNumber && <p className="text-red-500 text-xs mt-1">{errors.iglAlternateNumber}</p>}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {dynamicFields.length > 0 && (
//               <div className="border-b pb-6">
//                 <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Additional Information</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//                   {dynamicFields.map((field) => {
//                     const fieldError = errors[field.name]
//                     return (
//                       <div key={field.name}>
//                         <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
//                           {field.label} {field.required ? "*" : "(Optional)"}
//                         </label>
//                         {field.type === 'textarea' ? (
//                           <textarea
//                             name={field.name}
//                             value={formData[field.name] || ""}
//                             onChange={handleChange}
//                             required={field.required}
//                             placeholder={`Enter ${field.label.toLowerCase()}`}
//                             className={`w-full px-3 py-2 rounded-md border bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 focus:outline-none text-xs sm:text-sm ${fieldError ? "border-red-500 focus:border-red-500" : ""}`}
//                             rows={3}
//                           />
//                         ) : field.type === 'select' && field.options ? (
//                           <select
//                             name={field.name}
//                             value={formData[field.name] || ""}
//                             onChange={handleChange}
//                             required={field.required}
//                             className={`w-full px-3 py-2 rounded-md border bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 focus:outline-none text-xs sm:text-sm ${fieldError ? "border-red-500 focus:border-red-500" : ""}`}
//                           >
//                             <option value="">Select {field.label.toLowerCase()}</option>
//                             {field.options.map((opt: string) => (
//                               <option key={opt} value={opt}>{opt}</option>
//                             ))}
//                           </select>
//                         ) : (
//                           <Input
//                             name={field.name}
//                             type={field.type || "text"}
//                             value={formData[field.name] || ""}
//                             onChange={handleChange}
//                             required={field.required}
//                             placeholder={`Enter ${field.label.toLowerCase()}`}
//                             className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm ${fieldError ? "border-red-500 focus:border-red-500" : ""}`}
//                           />
//                         )}
//                         {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError}</p>}
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-end space-x-4 pt-4 flex-wrap gap-2">
//               <Link href="/dashboard">
//                 <Button type="button" variant="outline" className="hover:bg-primary/5 bg-transparent">
//                   Cancel
//                 </Button>
//               </Link>
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-shadow text-white"
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Submitting...
//                   </>
//                 ) : (
//                   "Submit Registration"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { toast } from "sonner"
import { ArrowLeft, Loader2, Trophy } from "lucide-react"
import Link from "next/link"

import type { User } from "@/src/db/schema/schema"

function FormNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-card/60 backdrop-blur-xl border-b border-primary/10 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg text-white shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300">
              <Trophy className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold gradient-text hidden sm:block">NAG • IronmanYT</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl shadow-lg shadow-primary/30 rounded-full transition-all duration-300 hover:scale-105 font-bold">
                Home
              </Button>
            </Link>
            <Link href="/auth/user/login">
              <Button variant="ghost" className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl shadow-lg shadow-primary/30 rounded-full transition-all duration-300 hover:scale-105 font-bold">
                Login
              </Button>
            </Link>
            <Link href="/auth/user/signup">
              <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl shadow-lg shadow-primary/30 rounded-full transition-all duration-300 hover:scale-105 font-bold">
                Signup
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function FormPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dynamicFields, setDynamicFields] = useState<any[]>([])
  const [registrationClosed, setRegistrationClosed] = useState(false)
  const [registrationDeadline, setRegistrationDeadline] = useState<string | null>(null)
  const [closureReason, setClosureReason] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [maxTeams, setMaxTeams] = useState<number | null>(null)
  const [currentTeams, setCurrentTeams] = useState<number>(0)
  const [formData, setFormData] = useState<any>({
    teamName: "",
    iglName: "",
    player1: "",
    playerId1: "",
    player2: "",
    playerId2: "",
    player3: "",
    playerId3: "",
    player4: "",
    playerId4: "",
    iglMail: "",
    iglAlternateMail: "",
    iglNumber: "",
    iglAlternateNumber: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      let toastShown = false
      try {
        // Fetch user data (optional for guest submissions)
        const userRes = await fetch("/api/user/profile")
        if (userRes.ok) {
          const userData = await userRes.json()
          setUser(userData)
        } else if (userRes.status !== 401) {
          console.error("Error fetching user profile:", userRes.status)
        }

        // Check registration status
        const configRes = await fetch("/api/admin/registration-config")
        if (configRes.ok) {
          const config = await configRes.json()
          setCurrentTeams(config.currentTeams || 0)

          if (config.maxTeams) {
            const maxTeamsNum = parseInt(config.maxTeams, 10)
            setMaxTeams(maxTeamsNum)
            if (config.currentTeams >= maxTeamsNum) {
              setRegistrationClosed(true)
              setClosureReason("Maximum teams allowed has been reached")
              if (!toastShown) {
                toast.error("Maximum teams allowed has been reached. Registration is now closed.")
                toastShown = true
              }
              return
            }
          }

          if (config.registrationStopAt) {
            const deadline = new Date(config.registrationStopAt)
            const now = new Date()
            if (deadline <= now) {
              setRegistrationClosed(true)
              setClosureReason("Registration deadline has passed")
              if (!toastShown) {
                toast.error("Registration deadline has passed. Registrations are closed.")
                toastShown = true
              }
              return
            }
            setRegistrationDeadline(config.registrationStopAt)
          }

          if (!config.isRegistrationOpen) {
            setRegistrationClosed(true)
            setClosureReason("Registration is closed by administrator")
            if (!toastShown) {
              toast.error("Registration is currently closed by administrator")
              toastShown = true
            }
            return
          }
        }

        const res = await fetch("/api/form-config")
        if (res.ok) {
          const data = await res.json()
          const fields = JSON.parse(data.fields || "[]")
          setDynamicFields(fields)
          const dynamicValues = fields.reduce((acc: any, f: any) => ({ ...acc, [f.name]: "" }), {})
          setFormData((prev: any) => ({ ...prev, ...dynamicValues }))
        }
      } catch (err) {
        console.error("Failed to load form config")
      }
    }

    // Load config without requiring authentication
    loadConfig()
  }, [router])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Trim and normalize data
    const trimmedData = {
      teamName: formData.teamName?.trim() || "",
      iglName: formData.iglName?.trim() || "",
      player1: formData.player1?.trim() || "",
      playerId1: formData.playerId1?.trim() || "",
      player2: formData.player2?.trim() || "",
      playerId2: formData.playerId2?.trim() || "",
      player3: formData.player3?.trim() || "",
      playerId3: formData.playerId3?.trim() || "",
      player4: formData.player4?.trim() || "",
      playerId4: formData.playerId4?.trim() || "",
      iglMail: formData.iglMail?.trim().toLowerCase() || "",
      iglAlternateMail: formData.iglAlternateMail?.trim().toLowerCase() || "",
      iglNumber: formData.iglNumber?.trim() || "",
      iglAlternateNumber: formData.iglAlternateNumber?.trim() || "",
    }

    // Team info validation
    if (!trimmedData.teamName || trimmedData.teamName.length < 2) {
      newErrors.teamName = "Team name must be at least 2 characters"
    }
    if (!trimmedData.iglName || trimmedData.iglName.length < 2) {
      newErrors.iglName = "IGL name must be at least 2 characters"
    }

    // Player 1 & 2 are mandatory
    if (!trimmedData.player1 || trimmedData.player1.length < 2) {
      newErrors.player1 = "Player 1 name is required"
    }
    if (!trimmedData.playerId1 || !/^\d{11}$/.test(trimmedData.playerId1)) {
      newErrors.playerId1 = "Player 1 ID must be exactly 11 digits"
    }

    if (!trimmedData.player2 || trimmedData.player2.length < 2) {
      newErrors.player2 = "Player 2 name is required"
    }
    if (!trimmedData.playerId2 || !/^\d{11}$/.test(trimmedData.playerId2)) {
      newErrors.playerId2 = "Player 2 ID must be exactly 11 digits"
    }

    // Player 3 & 4 are optional but validate if provided
    if (trimmedData.playerId3 && !/^\d{11}$/.test(trimmedData.playerId3)) {
      newErrors.playerId3 = "Player 3 ID must be exactly 11 digits"
    }
    if (trimmedData.playerId4 && !/^\d{11}$/.test(trimmedData.playerId4)) {
      newErrors.playerId4 = "Player 4 ID must be exactly 11 digits"
    }

    // Contact info validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedData.iglMail || !emailRegex.test(trimmedData.iglMail)) {
      newErrors.iglMail = "IGL email must be a valid email address"
    }
    if (trimmedData.iglAlternateMail && !emailRegex.test(trimmedData.iglAlternateMail)) {
      newErrors.iglAlternateMail = "Alternate email must be a valid email address"
    }
    if (!trimmedData.iglNumber || !/^\d{10}$/.test(trimmedData.iglNumber)) {
      newErrors.iglNumber = "IGL phone number must be exactly 10 digits"
    }
    if (trimmedData.iglAlternateNumber && !/^\d{10}$/.test(trimmedData.iglAlternateNumber)) {
      newErrors.iglAlternateNumber = "Alternate phone number must be exactly 10 digits"
    }

    // Validate dynamic fields
    dynamicFields.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix all validation errors", {
        description: "Check the highlighted fields and try again.",
        duration: 4000,
      })
      return
    }

    setIsLoading(true)

    try {
      // Generate guest user ID if not already stored
      let guestUserId = localStorage.getItem("guest_user_id")
      if (!guestUserId) {
        guestUserId = "guest_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
        localStorage.setItem("guest_user_id", guestUserId)
      }

      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, guestUserId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Team Registration Complete!", {
          description: "Your team has been successfully registered for the tournament.",
          duration: 5000,
          richColors: true,
        })
        // Reset form
        setFormData({
          teamName: "",
          iglName: "",
          player1: "",
          playerId1: "",
          player2: "",
          playerId2: "",
          player3: "",
          playerId3: "",
          player4: "",
          playerId4: "",
          iglMail: "",
          iglAlternateMail: "",
          iglNumber: "",
          iglAlternateNumber: "",
        })
        setErrors({})
        setIsSubmitted(true)
      } else {
        // Show specific error message
        const errorMessage = data.error || "Form submission failed. Please try again."
        toast.error("Registration Failed", {
          description: errorMessage,
          duration: 5000,
        })

        // If there are validation details, show them
        if (data.details && Array.isArray(data.details)) {
          console.log("[v0] Validation errors:", data.details)
        }
      }
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      toast.error("Connection Error", {
        description: "Unable to submit form. Please check your internet connection and try again.",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev: any) => ({ ...prev, [name]: checked }))
    } else {
      // Sanitize numeric fields: remove non-digit characters for ID and phone fields
      let sanitizedValue = value

      if (name.includes('Id') || name.includes('Number')) {
        sanitizedValue = value.replace(/\D/g, '')
      }

      // Trim whitespace for text fields
      if (type === 'text' || type === 'email') {
        // Store with full value but will trim on submission
        sanitizedValue = value
      }

      setFormData((prev: any) => ({ ...prev, [name]: sanitizedValue }))
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  if (registrationClosed) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <FormNavbar />
        <div className="pt-20 sm:pt-24 md:pt-8 py-6 sm:py-8 md:py-12 flex-1 flex items-center justify-center">
          <div className="max-w-md mx-auto px-3 sm:px-4">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 sm:p-8 text-center space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-red-500">Registration Closed</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {closureReason || "Registrations for the tournament are currently closed."}
              </p>
              {maxTeams && currentTeams && (
                <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 my-4">
                  <p className="text-xs sm:text-sm font-semibold text-foreground">Teams Capacity</p>
                  <p className="text-lg sm:text-xl font-bold text-primary mt-1">{currentTeams} / {maxTeams}</p>
                </div>
              )}
              <p className="text-xs sm:text-sm text-muted-foreground">
                Please contact the administrator for more information.
              </p>
              <Link href="/dashboard">
                <Button className="w-full mt-4">Go Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <FormNavbar />
        <div className="pt-20 sm:pt-24 md:pt-8 py-6 sm:py-8 md:py-12 flex-1 flex items-center justify-center">
          <div className="max-w-md mx-auto px-3 sm:px-4">
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-6 sm:p-8 text-center space-y-6">
              <div className="flex justify-center">
                <Trophy className="w-16 h-16 text-green-500" />
              </div>
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-green-500">Registration Successful!</h1>
                <p className="text-sm sm:text-base text-foreground font-medium">Your team has been successfully registered for the tournament.</p>
              </div>
              <div className="bg-card/50 rounded-lg p-4 space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">Want to check tournament schedules, registered teams count, and more?</p>
                <p className="text-sm font-semibold text-foreground">Please login to your account to access these features.</p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg shadow-lg shadow-primary/30 transition-all duration-300 font-bold">
                    Continue to Login
                  </Button>
                </Link>
                <Link href="/" className="w-full">
                  <Button variant="outline" className="w-full hover:bg-primary/5">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <FormNavbar />
      <div className="sm:pt-24 md:pt-5 py-6 sm:py-8 md:py-12 flex-1 mt-20">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col gap-4 mb-6 sm:mb-8 items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">Tournament Registration Form</h1>
              <p className="mt-2 text-center sm:text-sm text-muted-foreground">Fill out all the details for your team registration</p>
            </div>
          </div>
          {registrationDeadline && (
            <p className="text-lg sm:text-xs md:text-lg font-bold text-primary mb-3 sm:mb-4 text-center">
              Deadline: <span className="text-pretty/20 text-lg">{new Date(registrationDeadline).toLocaleString()}</span>
            </p>
          )}
          <form onSubmit={handleSubmit} className="card-glow rounded-xl border p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <div className="border-b pb-4 sm:pb-6">
              <div className="mb-4 sm:mb-6 text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Team Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">Team Name *</label>
                  <Input
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    required
                    placeholder="Enter team name"
                    className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm ${errors.teamName ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  {errors.teamName && <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">IGL (In-Game Leader) Name *</label>
                  <Input
                    name="iglName"
                    value={formData.iglName}
                    onChange={handleChange}
                    required
                    placeholder="Enter IGL name"
                    className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm ${errors.iglName ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  {errors.iglName && <p className="text-red-500 text-xs mt-1">{errors.iglName}</p>}
                </div>
              </div>
            </div>

            <div className="border-b pb-4 sm:pb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Player Details</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Player 1 & 2 are mandatory. Player 3 & 4 are optional.</p>
              {[1, 2, 3, 4].map((num) => {
                const isMandatory = num <= 2
                const playerNameKey = `player${num}` as keyof typeof formData
                const playerIdKey = `playerId${num}` as keyof typeof formData
                return (
                  <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
                        Player {num} In-Game Name {isMandatory ? "*" : "(Optional)"}
                      </label>
                      <Input
                        name={`player${num}`}
                        value={formData[playerNameKey]}
                        onChange={handleChange}
                        required={isMandatory}
                        placeholder={`Enter player ${num} name`}
                        className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm ${errors[`player${num}`] ? "border-red-500 focus:border-red-500" : ""}`}
                      />
                      {errors[`player${num}`] && <p className="text-red-500 text-xs mt-1">{errors[`player${num}`]}</p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
                        Player {num} ID {isMandatory ? "*" : "(Optional)"}{/* {!isMandatory && <span className="text-xs text-muted-foreground">(11 digits)</span>} */}
                      </label>
                      <Input
                        name={`playerId${num}`}
                        value={formData[playerIdKey]}
                        onChange={handleChange}
                        required={isMandatory}
                        placeholder={`Enter ${isMandatory ? "" : ""}11 digit ID`}
                        className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm ${errors[`playerId${num}`] ? "border-red-500 focus:border-red-500" : ""}`}
                      />
                      {errors[`playerId${num}`] && <p className="text-red-500 text-xs mt-1">{errors[`playerId${num}`]}</p>}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-b pb-4 sm:pb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Contact Information</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Primary email & phone are mandatory. Alternate details are optional.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">IGL Email *</label>
                    <Input
                      name="iglMail"
                      type="email"
                      value={formData.iglMail}
                      onChange={handleChange}
                      required
                      placeholder="Enter IGL email"
                      className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 ${errors.iglMail ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                    {errors.iglMail && <p className="text-red-500 text-xs mt-1">{errors.iglMail}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Alternate Email (Optional)</label>
                    <Input
                      name="iglAlternateMail"
                      type="email"
                      value={formData.iglAlternateMail}
                      onChange={handleChange}
                      placeholder="Enter alternate email"
                      className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 ${errors.iglAlternateMail ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                    {errors.iglAlternateMail && <p className="text-red-500 text-xs mt-1">{errors.iglAlternateMail}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">IGL Phone Number * <span className="text-xs text-muted-foreground">(10 digits)</span></label>
                    <Input
                      name="iglNumber"
                      value={formData.iglNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter 10 digit phone number"
                      className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 ${errors.iglNumber ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                    {errors.iglNumber && <p className="text-red-500 text-xs mt-1">{errors.iglNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Alternate Phone Number (Optional)
                    </label>
                    <Input
                      name="iglAlternateNumber"
                      value={formData.iglAlternateNumber}
                      onChange={handleChange}
                      placeholder="Enter Alternate 10 digit phone number"
                      className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 ${errors.iglAlternateNumber ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                    {errors.iglAlternateNumber && <p className="text-red-500 text-xs mt-1">{errors.iglAlternateNumber}</p>}
                  </div>
                </div>
              </div>
            </div>

            {dynamicFields.length > 0 && (
              <div className="border-b pb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {dynamicFields.map((field) => {
                    const fieldError = errors[field.name]
                    return (
                      <div key={field.name}>
                        <label htmlFor={field.name} className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
                          {field.label} {field.required ? "*" : "(Optional)"}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            required={field.required}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            className={`w-full px-3 py-2 rounded-md border bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 focus:outline-none text-xs sm:text-sm ${fieldError ? "border-red-500 focus:border-red-500" : ""}`}
                            rows={3}
                          />
                        ) : field.type === 'select' && field.options ? (
                          <select
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            required={field.required}
                            className={`w-full px-3 py-2 rounded-md border bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 focus:outline-none text-xs sm:text-sm ${fieldError ? "border-red-500 focus:border-red-500" : ""}`}
                          >
                            <option value="">Select {field.label.toLowerCase()}</option>
                            {field.options.map((opt: string) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            id={field.name}
                            name={field.name}
                            type={field.type || "text"}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            required={field.required}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            className={`bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm ${fieldError ? "border-red-500 focus:border-red-500" : ""}`}
                          />
                        )}
                        {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError}</p>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4 flex-wrap gap-2">
              <Link href="/dashboard">
                <Button type="button" variant="outline" className="hover:bg-primary/5 bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-shadow text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
