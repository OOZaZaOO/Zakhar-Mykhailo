export const specialist = {
  name: "Maya Sterling",
  title: "Product Strategy Advisor",
  slug: "maya-sterling",
  timezone: "Europe/Kyiv",
  rating: "4.9",
  sessions: "184",
  bio: "Helps founders and operators turn fuzzy product ideas into focused roadmaps, launch plans, and weekly execution habits.",
  tags: ["Product strategy", "Founder coaching", "Roadmaps"],
};

export const services = [
  {
    id: "roadmap-reset",
    name: "Roadmap Reset",
    duration: "60 min",
    price: "$180",
    status: "Active",
    format: "Online",
    description:
      "Clarify priorities, cut scope, and leave with a practical next-week plan.",
  },
  {
    id: "launch-review",
    name: "Launch Review",
    duration: "45 min",
    price: "$140",
    status: "Active",
    format: "Online",
    description:
      "Tighten positioning, onboarding, and the first user journey before launch.",
  },
  {
    id: "async-audit",
    name: "Async Product Audit",
    duration: "2 days",
    price: "$320",
    status: "Draft",
    format: "Async",
    description:
      "A written review of onboarding, positioning, and activation friction.",
  },
];

export const sessions = [
  {
    id: "sess-1001",
    client: "Nina Park",
    email: "nina@example.com",
    service: "Roadmap Reset",
    time: "Today, 16:00",
    status: "Ready",
    payment: "Paid",
    note: "Wants help narrowing the next two roadmap bets before investor updates.",
  },
  {
    id: "sess-1002",
    client: "Andre Costa",
    email: "andre@example.com",
    service: "Launch Review",
    time: "Tomorrow, 11:30",
    status: "Needs Meet link",
    payment: "Pending",
    note: "Bringing onboarding screenshots and first-week retention notes.",
  },
  {
    id: "sess-1003",
    client: "Vera Holt",
    email: "vera@example.com",
    service: "Roadmap Reset",
    time: "Jul 8, 14:00",
    status: "Materials sent",
    payment: "Paid",
    note: "Follow-up session after the first product discovery sprint.",
  },
];

export const dashboardStats = [
  "Profile 92%",
  "2 active services",
  "18 open slots",
];

export const materials = [
  "Discovery brief template",
  "Session agenda",
  "Roadmap scoring sheet",
];

export const chat = [
  {
    sender: "Nina",
    body: "I added our current roadmap and the customer notes from last week.",
    time: "09:18",
  },
  {
    sender: "Maya",
    body: "Perfect. I marked three places where we can simplify the launch plan.",
    time: "09:34",
  },
];

export const featureCards = [
  {
    title: "Create your profile",
    text: "Share one personal link with your clients.",
  },
  {
    title: "Accept bookings",
    text: "Clients book only available time slots.",
  },
  {
    title: "Run every session",
    text: "Share meeting links, files, notes and materials inside each session workspace.",
  },
  {
    title: "Keep everything archived",
    text: "Every completed session stays organized and accessible for future reference.",
  },
];

export const bookingTimes = ["10:00", "13:30", "16:00"];

export const meetLink = "meet.google.com/bmt-roadmap-reset";

export const calendarDays = [
  { day: "Mon", date: "8", slots: ["10:00", "14:00"] },
  { day: "Tue", date: "9", slots: ["11:30"] },
  { day: "Wed", date: "10", slots: ["09:00", "16:00"] },
  { day: "Thu", date: "11", slots: ["13:30"] },
  { day: "Fri", date: "12", slots: ["10:00", "15:30"] },
];

export const archiveSessions = [
  {
    id: "arch-0901",
    client: "Lena Morris",
    service: "Launch Review",
    date: "Jun 26",
    status: "Completed",
    materials: 3,
  },
  {
    id: "arch-0902",
    client: "Sam Ritter",
    service: "Roadmap Reset",
    date: "Jun 21",
    status: "Archived",
    materials: 4,
  },
  {
    id: "arch-0903",
    client: "Iris Chen",
    service: "Async Product Audit",
    date: "Jun 18",
    status: "Completed",
    materials: 2,
  },
];

export const recentBookings = [
  "Nina booked Roadmap Reset for today",
  "Andre added pre-session notes",
  "Vera opened the shared roadmap scoring sheet",
];

export const settingsSections = [
  "Profile basics",
  "Password",
  "Notifications",
  "Availability defaults",
  "Meeting links",
  "Danger zone",
];
