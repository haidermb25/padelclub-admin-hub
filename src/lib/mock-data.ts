export type Registration = {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  status: "active" | "cancelled";
};

export type Booking = {
  id: string;
  user: string;
  court: string;
  branch: string;
  date: string;
  slot: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  amount: number;
};

export type Court = {
  id: string;
  name: string;
  type: "Indoor" | "Outdoor";
  branch: string;
  available: boolean;
};

export type Payment = {
  id: string;
  bookingId: string;
  user: string;
  amount: number;
  status: "paid" | "pending" | "refunded" | "failed";
  date: string;
  method: "Card" | "Cash" | "Wallet";
};

const firstNames = ["Ahmed", "Sara", "Omar", "Layla", "Khaled", "Noura", "Yousef", "Fatima", "Hassan", "Mariam", "Tariq", "Zainab", "Adam", "Lina", "Bilal", "Hana", "Faris", "Reem", "Saif", "Dana"];
const lastNames = ["Al-Saud", "Mansour", "Khalifa", "Hassan", "Yousef", "Al-Farsi", "Nasser", "Ibrahim", "Aziz", "Karim"];
const courtsList = ["Court Alpha", "Court Beta", "Court Gamma", "Court Delta", "Court Omega"];
const branches = ["Downtown", "Marina", "Westside", "Skyline"];

const seed = (n: number) => {
  let s = n;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const rnd = seed(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];

const daysAgo = (d: number) => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
};

export const registrations: Registration[] = Array.from({ length: 64 }).map((_, i) => ({
  id: `USR-${String(1000 + i).padStart(5, "0")}`,
  name: `${pick(firstNames)} ${pick(lastNames)}`,
  email: `player${i + 1}@thelapadel.club`,
  phone: `+971 5${Math.floor(rnd() * 90000000 + 10000000)}`,
  registeredAt: daysAgo(Math.floor(rnd() * 90)),
  status: rnd() > 0.18 ? "active" : "cancelled",
}));

const slots = ["08:00 - 09:30", "09:30 - 11:00", "11:00 - 12:30", "16:00 - 17:30", "17:30 - 19:00", "19:00 - 20:30", "20:30 - 22:00"];
const statuses: Booking["status"][] = ["confirmed", "confirmed", "confirmed", "completed", "pending", "cancelled"];

export const bookings: Booking[] = Array.from({ length: 80 }).map((_, i) => ({
  id: `BKG-${String(2000 + i).padStart(5, "0")}`,
  user: `${pick(firstNames)} ${pick(lastNames)}`,
  court: pick(courtsList),
  branch: pick(branches),
  date: daysAgo(Math.floor(rnd() * 30) - 5),
  slot: pick(slots),
  status: pick(statuses),
  amount: Math.floor(rnd() * 200 + 80),
}));

export const courts: Court[] = [
  { id: "C-01", name: "Court Alpha", type: "Indoor", branch: "Downtown", available: true },
  { id: "C-02", name: "Court Beta", type: "Outdoor", branch: "Downtown", available: true },
  { id: "C-03", name: "Court Gamma", type: "Indoor", branch: "Marina", available: false },
  { id: "C-04", name: "Court Delta", type: "Outdoor", branch: "Marina", available: true },
  { id: "C-05", name: "Court Omega", type: "Indoor", branch: "Westside", available: true },
  { id: "C-06", name: "Court Sigma", type: "Outdoor", branch: "Skyline", available: true },
  { id: "C-07", name: "Court Zeta", type: "Indoor", branch: "Skyline", available: false },
];

export const payments: Payment[] = bookings.slice(0, 50).map((b, i) => ({
  id: `PAY-${String(3000 + i).padStart(5, "0")}`,
  bookingId: b.id,
  user: b.user,
  amount: b.amount,
  status: rnd() > 0.85 ? "refunded" : rnd() > 0.92 ? "pending" : "paid",
  date: b.date,
  method: pick(["Card", "Card", "Wallet", "Cash"] as Payment["method"][]),
}));

// Aggregates
export const trendData = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    registrations: Math.floor(rnd() * 20 + 8),
    bookings: Math.floor(rnd() * 35 + 15),
    revenue: Math.floor(rnd() * 3000 + 1500),
  };
});

export const monthlyData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => ({
  month: m,
  registrations: Math.floor(rnd() * 200 + 80),
  cancelled: Math.floor(rnd() * 40 + 5),
}));

export const branchDistribution = branches.map((b) => ({
  name: b,
  value: Math.floor(rnd() * 80 + 30),
}));

export const recentActivity = [
  { id: 1, type: "registration", text: "New player Ahmed Mansour registered", time: "2 min ago" },
  { id: 2, type: "booking", text: "Court Alpha booked for 19:00 - 20:30", time: "12 min ago" },
  { id: 3, type: "payment", text: "Payment of $120 received from Sara Khalifa", time: "28 min ago" },
  { id: 4, type: "cancellation", text: "Booking BKG-02041 was cancelled", time: "1 hr ago" },
  { id: 5, type: "registration", text: "New player Layla Aziz registered", time: "2 hr ago" },
  { id: 6, type: "booking", text: "Court Delta booked for 17:30 - 19:00", time: "3 hr ago" },
];
