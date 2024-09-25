"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { signIn } from "next-auth/react"

import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"


const formSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    })
})

const signUpFormSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

const otpSchema = z.object({
    otp: z.string().min(6, {
        message: "OTP must be at least 6 characters.",
    })
})

export default function LoginForm() {
    const [otpActive, setOtpActive] = useState(false)
    const [currOtp, setCurrOtp] = useState("")
    const { toast } = useToast()

    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: ""
        }
    })

    async function onSignUpSubmit(values: z.infer<typeof signUpFormSchema>) {
        await sendVerificationEmail(values.email);

        // Get the current date and time
        const now = new Date();

        // Format the date and time
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true
        };

        const formattedDate = now.toLocaleDateString("en-US", options);

        toast({
            title: "An OTP has been sent to your email.",
            description: formattedDate
        });

        setOtpActive(true);
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        })


        if (response?.ok) {
            router.push("/")
            router.refresh()
        }
        else {
            form.setError("password", {
                message: "Invalid email or password"
            })
        }
    }

    async function handleRegistration(otpValues: z.infer<typeof otpSchema>) {
        if (otpValues.otp !== currOtp) {
            otpForm.setError("otp", {
                message: "Invalid OTP"
            })
            return
        }
        const values = signUpForm.getValues()
        if (values.password !== values.confirmPassword) {
            console.log("Passwords do not match")
        }
        const response = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(values)
        })

        if (response.status === 409 || response.status === 400) {
            signUpForm.setError("email", {
                message: "Email already exists."
            })
            return
        }

        if (response.ok) {
            const signInResponse = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            })

            if (signInResponse?.ok) {
                router.push("/")
                // router.refresh()
            }

        }
    }



    async function sendVerificationEmail(email: string) {
        const otp = Math.floor(100000 + Math.random() * 900000)
        setCurrOtp(otp.toString())
        const res = await fetch("/api/auth/sendgrid", {
            body: JSON.stringify({
                email: email,
                sender: "2041001037.faridahmed@gmail.com",
                recipient: email,
                subject: 'Email Verification',
                otp: otp,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });


        const { error } = await res.json();
        if (error) {
            console.log(error);
            return;
        }
    }



    return (
        <main className="flex justify-center items-center h-screen">
            <Tabs defaultValue="account" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Sign In</TabsTrigger>
                    <TabsTrigger value="password">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome</CardTitle>
                            <CardDescription>
                                Sign in to your account to access your dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="john doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="password" type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Submit</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                            <CardDescription>
                                Enter the details below to create an account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...signUpForm}>
                                <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                                    <FormField
                                        control={signUpForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="john doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signUpForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="password" type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={signUpForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Re-enter Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Confirm Password" type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {!otpActive && (<Button type="submit">Send OTP</Button>)}

                                </form>
                            </Form>
                            {otpActive && (<>
                                <Form {...otpForm}>
                                    <form onSubmit={otpForm.handleSubmit(handleRegistration)} className="space-y-4 mt-2">
                                        <FormField
                                            control={otpForm.control}
                                            name="otp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Enter OTP</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="OTP" type="text" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                        >Register</Button>
                                    </form>
                                </Form>
                            </>)}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

        </main>
    )
}
