
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { createPatientAction } from "../actions";
import { 
  NewPatientFormSchema, 
  type NewPatientFormValues, 
  type CreatePatientActionResult 
} from "../schemas";

export default function AddNewPatientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NewPatientFormValues>({
    resolver: zodResolver(NewPatientFormSchema),
    defaultValues: {
      name: "",
      age: undefined, // Default to undefined for coerce.number()
      gender: undefined,
      contact: "",
      address: "",
      medicalHistory: "",
    },
  });

  async function onSubmit(values: NewPatientFormValues) {
    setIsLoading(true);
    form.clearErrors(); // Clear previous errors

    const result: CreatePatientActionResult = await createPatientAction(values);

    setIsLoading(false);

    if (result.success && result.patient) {
      toast({
        title: "Success!",
        description: result.success,
        variant: "default",
      });
      router.push("/patients"); // Redirect to patients list
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add patient. Please try again.",
        variant: "destructive",
      });
      if (result.errors) {
        Object.keys(result.errors).forEach((key) => {
          const field = key as keyof NewPatientFormValues;
          const message = result.errors?.[field]?.[0];
          if (message) {
            form.setError(field, { type: "server", message });
          }
        });
        if (result.errors._form) {
           form.setError("root.serverError" as any, { type: "custom", message: result.errors._form.join(', ') });
        }
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.UserPlus className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Add New Patient</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/patients">
            <Icons.ChevronLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Patient Details</CardTitle>
          <CardDescription>Fill in the form below to add a new patient record.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 35" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Information</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., john.doe@example.com or +1234567890" {...field} />
                    </FormControl>
                     <FormDescription>
                      Email address or phone number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 123 Main St, Anytown, USA" {...field} rows={3}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Allergies, past conditions, etc." {...field} rows={4}/>
                    </FormControl>
                    <FormDescription>
                      Brief summary of relevant medical history.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {form.formState.errors.root?.serverError && (
                <FormMessage className="text-destructive">
                  {form.formState.errors.root.serverError.message}
                </FormMessage>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
               <Button type="button" variant="outline" onClick={() => router.push('/patients')} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <>
                    <Icons.Clock className="mr-2 h-4 w-4 animate-spin" />
                    Adding Patient...
                  </>
                ) : (
                  <>
                    <Icons.UserPlus className="mr-2 h-4 w-4" />
                    Add Patient
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
