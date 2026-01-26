"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

import type { User } from "@/src/db/schema/schema"

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

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Fetch user data
        const userRes = await fetch("/api/user/profile")
        if (userRes.ok) {
          const userData = await userRes.json()
          setUser(userData)
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
              toast.error("Maximum teams allowed has been reached. Registration is now closed.")
              return
            }
          }

          if (config.registrationStopAt) {
            const deadline = new Date(config.registrationStopAt)
            const now = new Date()
            if (deadline <= now) {
              setRegistrationClosed(true)
              setClosureReason("Registration deadline has passed")
              toast.error("Registration deadline has passed. Registrations are closed.")
              return
            }
            setRegistrationDeadline(config.registrationStopAt)
          }

          if (!config.isRegistrationOpen) {
            setRegistrationClosed(true)
            setClosureReason("Registration is closed by administrator")
            toast.error("Registration is currently closed by administrator")
            return
          }
        }

        const res = await fetch("/api/admin/form-config")
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

    fetch("/api/auth/check")
      .then(() => loadConfig())
      .catch(() => {
        router.push("/auth/login")
      })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Form submitted successfully!")
        router.push("/dashboard")
      } else {
        toast.error(data.error || "Form submission failed")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  if (registrationClosed) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="pt-20 sm:pt-24 md:pt-28 py-6 sm:py-8 md:py-12 flex-1 flex items-center justify-center">
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="pt-20 sm:pt-24 md:pt-28 py-6 sm:py-8 md:py-12 flex-1">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">Tournament Registration Form</h1>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">Fill out all the details for your team registration</p>
              {registrationDeadline && (
                <p className="text-xs sm:text-sm text-primary mt-2">Deadline: {new Date(registrationDeadline).toLocaleString()}</p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card-glow rounded-xl border p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <div className="border-b pb-4 sm:pb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Team Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">Team Name *</label>
                  <Input
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    required
                    placeholder="Enter team name"
                    className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">IGL (In-Game Leader) Name *</label>
                  <Input
                    name="iglName"
                    value={formData.iglName}
                    onChange={handleChange}
                    required
                    placeholder="Enter IGL name"
                    className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-4 sm:pb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Player Details</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Player 1 & 2 are mandatory. Player 3 & 4 are optional.</p>
              {[1, 2, 3, 4].map((num) => {
                const isMandatory = num <= 2
                return (
                  <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
                        Player {num} Name {isMandatory ? "*" : "(Optional)"}
                      </label>
                      <Input
                        name={`player${num}`}
                        value={formData[`player${num}` as keyof typeof formData]}
                        onChange={handleChange}
                        required={isMandatory}
                        placeholder={`Enter player ${num} name`}
                        className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
                        Player {num} ID {isMandatory ? "*" : "(Optional)"}
                      </label>
                      <Input
                        name={`playerId${num}`}
                        value={formData[`playerId${num}` as keyof typeof formData]}
                        onChange={handleChange}
                        required={isMandatory}
                        placeholder={`Enter player ${num} game ID`}
                        className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm"
                      />
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
                      className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Alternate Email (Optional)</label>
                    <Input
                      name="iglAlternateMail"
                      type="email"
                      value={formData.iglAlternateMail}
                      onChange={handleChange}
                      placeholder="Enter alternate email"
                      className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">IGL Phone Number *</label>
                    <Input
                      name="iglNumber"
                      value={formData.iglNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter IGL phone number"
                      className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Alternate Phone Number (Optional)
                    </label>
                    <Input
                      name="iglAlternateNumber"
                      value={formData.iglAlternateNumber}
                      onChange={handleChange}
                      placeholder="Enter alternate phone number"
                      className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {dynamicFields.length > 0 && (
              <div className="border-b pb-6">
                <h2 className="text-xl font-bold text-primary mb-4">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dynamicFields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {field.label} {field.required ? "*" : "(Optional)"}
                      </label>
                      <Input
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        required={field.required}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                  ))}
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
