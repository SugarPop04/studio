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

      <div className="mb-4 relative">
        <Icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search doctors by name or specialization..." className="max-w-md pl-10" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center text-center"> {/* Centered text in header */}
              <Image
                alt={`${doctor.name}'s avatar`}
                className="aspect-square rounded-full object-cover mb-4 border-2 border-primary/30 shadow-md" /* Added shadow to avatar */
                height="120"
                src={doctor.avatarUrl}
                width="120"
                data-ai-hint="doctor portrait"
              />
              <CardTitle className="text-xl">{doctor.name}</CardTitle>
              <CardDescription className="text-primary font-medium">{doctor.specialization}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-2"> {/* Added space-y-2 */}
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Department:</span> {doctor.department}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Contact:</span> {doctor.contact}
              </div>
              <div>
                <span className="font-medium text-foreground text-sm">Availability:</span>
                <ul className="list-disc list-inside ml-1 text-sm text-muted-foreground">
                  {doctor.availability.slice(0, 2).map(avail => ( 
                    <li key={avail.day}>{avail.day}: {avail.times.join(', ')}</li>
                  ))}
                  {doctor.availability.length > 2 && <li className="text-xs">...and more</li>}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="pt-4"> {/* Added pt-4 */}
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
