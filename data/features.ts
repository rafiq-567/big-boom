export type Feature = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export const features: Feature[] = [
  {
    id: "fast",
    title: "Fast Performance",
    description: "Optimized rendering and routing using Next.js App Router.",
  },
  {
    id: "secure",
    title: "Secure Authentication",
    description: "Protected routes and session-based authentication.",
  },
  {
    id: "responsive",
    title: "Responsive Design",
    description: "Works seamlessly across all devices.",
  },
];
