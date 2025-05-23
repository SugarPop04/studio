
import { patientsData, type Patient } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";

async function getPatientById(id: string): Promise<Patient | undefined> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return patientsData.find((p) => p.id === id);
}

interface PatientDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const patient = await getPatientById(params.id);

  if (!patient) {
    notFound(); // Or return a custom "Patient not found" component
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/30">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person avatar" />
            <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
            <p className="text-muted-foreground">Patient ID: {patient.id}</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/patients">
            <Icons.ChevronLeft className="mr-2 h-4 w-4" />
            Back to Patients List
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
          <CardDescription>Detailed information about the patient.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"> {/* Increased gap-y */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Age</p>
              <p className="text-lg font-medium">{patient.age}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gender</p>
              <p className="text-lg font-medium">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <p className="text-lg font-medium">{patient.contact}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
              <p className="text-lg font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p className="text-lg whitespace-pre-line font-medium">{patient.address}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground">Medical History</p>
            <p className="text-lg whitespace-pre-line font-medium">{patient.medicalHistory || "N/A"}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-4"> {/* Added pt-4 */}
            <Button variant="outline" asChild>
              <Link href={`/patients/${patient.id}/edit`}>
                <Icons.Edit className="mr-2 h-4 w-4" /> Edit Patient
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/appointments/new?patientId=${patient.id}`}>
                <Icons.CalendarPlus className="mr-2 h-4 w-4" /> Book Appointment
              </Link>
            </Button>
        </CardFooter>
      </Card>
      <p className="text-sm text-muted-foreground">
        Note: The "Edit Patient" functionality is not yet fully implemented. Clicking it will lead to a page that needs to be created.
      </p>
    </div>
  );
}
