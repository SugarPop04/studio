export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contact: string;
  address: string;
  medicalHistory: string;
  lastVisit: string; // ISO date string
  avatarUrl: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availability: Array<{ day: string; times: string[] }>;
  contact: string;
  avatarUrl: string;
  department: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string; // ISO date string
  time: string; // e.g., "10:00 AM"
  type: "Check-up" | "Consultation" | "Follow-up" | "Procedure";
  status: "Scheduled" | "Completed" | "Cancelled" | "Pending";
  notes?: string;
}

export const patientsData: Patient[] = [
  {
    id: "P001",
    name: "Alice Wonderland",
    age: 30,
    gender: "Female",
    contact: "alice@example.com",
    address: "123 Rabbit Hole Ln",
    medicalHistory: "None",
    lastVisit: "2023-10-15",
    avatarUrl: "https://placehold.co/100x100.png?text=AW",
  },
  {
    id: "P002",
    name: "Bob The Builder",
    age: 45,
    gender: "Male",
    contact: "bob@example.com",
    address: "456 Fixit St",
    medicalHistory: "Hypertension",
    lastVisit: "2023-11-01",
    avatarUrl: "https://placehold.co/100x100.png?text=BB",
  },
  {
    id: "P003",
    name: "Charlie Brown",
    age: 8,
    gender: "Male",
    contact: "charlie@example.com",
    address: "789 Kite Hill",
    medicalHistory: "Asthma",
    lastVisit: "2023-09-20",
    avatarUrl: "https://placehold.co/100x100.png?text=CB",
  },
  {
    id: "P004",
    name: "Diana Prince",
    age: 35,
    gender: "Female",
    contact: "diana@example.com",
    address: "1 Wonder Way",
    medicalHistory: "Healthy",
    lastVisit: "2024-01-10",
    avatarUrl: "https://placehold.co/100x100.png?text=DP",
  },
   {
    id: "P005",
    name: "Edward Scissorhands",
    age: 28,
    gender: "Male",
    contact: "edward@example.com",
    address: "55 Suburbia Ave",
    medicalHistory: "Requires specialized care",
    lastVisit: "2024-02-01",
    avatarUrl: "https://placehold.co/100x100.png?text=ES",
  },
];

export const doctorsData: Doctor[] = [
  {
    id: "D001",
    name: "Dr. Eleanor Rigby",
    specialization: "Cardiology",
    availability: [
      { day: "Mon", times: ["9am-12pm", "2pm-5pm"] },
      { day: "Wed", times: ["9am-12pm"] },
      { day: "Fri", times: ["2pm-5pm"] },
    ],
    contact: "eleanor@meditrack.com",
    avatarUrl: "https://placehold.co/100x100.png?text=ER",
    department: "Cardiology",
  },
  {
    id: "D002",
    name: "Dr. Gregory House",
    specialization: "Diagnostics",
    availability: [
      { day: "Tue", times: ["10am-1pm", "3pm-6pm"] },
      { day: "Thu", times: ["10am-1pm"] },
    ],
    contact: "gregory@meditrack.com",
    avatarUrl: "https://placehold.co/100x100.png?text=GH",
    department: "Internal Medicine",
  },
  {
    id: "D003",
    name: "Dr. Meredith Grey",
    specialization: "General Surgery",
    availability: [
      { day: "Mon", times: ["8am-11am"] },
      { day: "Wed", times: ["1pm-4pm"] },
      { day: "Fri", times: ["8am-11am", "1pm-4pm"] },
    ],
    contact: "meredith@meditrack.com",
    avatarUrl: "https://placehold.co/100x100.png?text=MG",
    department: "Surgery",
  },
   {
    id: "D004",
    name: "Dr. John Watson",
    specialization: "Pediatrics",
    availability: [
      { day: "Tue", times: ["9am-5pm"] },
      { day: "Thu", times: ["9am-5pm"] },
    ],
    contact: "john.watson@meditrack.com",
    avatarUrl: "https://placehold.co/100x100.png?text=JW",
    department: "Pediatrics",
  },
];

export const appointmentsData: Appointment[] = [
  {
    id: "A001",
    patientId: "P001",
    patientName: "Alice Wonderland",
    doctorId: "D001",
    doctorName: "Dr. Eleanor Rigby",
    date: "2024-07-15",
    time: "10:00 AM",
    type: "Check-up",
    status: "Scheduled",
  },
  {
    id: "A002",
    patientId: "P002",
    patientName: "Bob The Builder",
    doctorId: "D002",
    doctorName: "Dr. Gregory House",
    date: "2024-07-16",
    time: "11:30 AM",
    type: "Consultation",
    status: "Completed",
  },
  {
    id: "A003",
    patientId: "P003",
    patientName: "Charlie Brown",
    doctorId: "D003",
    doctorName: "Dr. Meredith Grey",
    date: "2024-07-17",
    time: "02:00 PM",
    type: "Follow-up",
    status: "Scheduled",
  },
  {
    id: "A004",
    patientId: "P004",
    patientName: "Diana Prince",
    doctorId: "D001",
    doctorName: "Dr. Eleanor Rigby",
    date: "2024-07-18",
    time: "09:00 AM",
    type: "Check-up",
    status: "Cancelled",
  },
   {
    id: "A005",
    patientId: "P001",
    patientName: "Alice Wonderland",
    doctorId: "D002",
    doctorName: "Dr. Gregory House",
    date: "2024-07-20",
    time: "03:30 PM",
    type: "Consultation",
    status: "Pending",
  },
];

// For AI Optimizer
export const samplePatientHistory = `
- Patient A: Mon 9 AM (30 min), Tue 2 PM (45 min), Fri 11 AM (30 min)
- Patient B: Wed 10 AM (60 min), Thu 3 PM (30 min)
- Patient C: Mon 3 PM (45 min), Fri 9 AM (60 min)
- General trend: Morning slots (9-11 AM) are popular for shorter appointments (30-45 min). Afternoon slots (2-4 PM) are preferred for longer consultations (60 min+). Mid-day (12-1 PM) is usually less busy.
`;

export const sampleDoctorAvailability = `
- Dr. Smith: Mon 9 AM - 5 PM, Tue 9 AM - 1 PM, Wed 1 PM - 5 PM, Thu Off, Fri 9 AM - 12 PM. Lunch break 12 PM - 1 PM daily.
- Dr. Jones: Mon 10 AM - 6 PM, Tue Off, Wed 10 AM - 2 PM, Thu 9 AM - 5 PM, Fri 1 PM - 4 PM. Lunch break 1 PM - 2 PM daily.
`;
