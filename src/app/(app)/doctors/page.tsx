import Image from "next/image";
import { doctorsData, type Doctor } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import Link from "next/link";

async function getDoctors(): Promise<Doctor[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return doctorsData;
}

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Doctor Directory</h1>
         <Link href="/doctors/new">
          <Button>
            <Icons.PlusCircle className="mr-2 h-4 w-4" />
            Add New Doctor
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <Input placeholder="Search doctors by name or specialization..." className="max-w-md" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="flex flex-col">
            <CardHeader className="items-center">
              <Image
                alt={`${doctor.name}'s avatar`}
                className="aspect-square rounded-full object-cover mb-4 border-2 border-primary/20"
                height="120"
                src={doctor.avatarUrl}
                width="120"
                data-ai-hint="doctor portrait"
              />
              <CardTitle className="text-xl">{doctor.name}</CardTitle>
              <CardDescription className="text-primary">{doctor.specialization}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="font-medium text-foreground">Department:</span> {doctor.department}</p>
                <p><span className="font-medium text-foreground">Contact:</span> {doctor.contact}</p>
                <div>
                  <span className="font-medium text-foreground">Availability:</span>
                  <ul className="list-disc list-inside ml-1">
                    {doctor.availability.slice(0, 2).map(avail => ( // Show first 2 for brevity
                      <li key={avail.day}>{avail.day}: {avail.times.join(', ')}</li>
                    ))}
                    {doctor.availability.length > 2 && <li>...and more</li>}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Icons.View className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
