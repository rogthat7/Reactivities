import { z } from "zod";

const requiredString = (fieldName: string) => z.string({required_error:`${fieldName} is Required`}).min(3, {
  message: `${fieldName} is requires minimum 3 characters`
});
export const activitySchema = z.object({
  title: requiredString('Title'),
  date: z.coerce.date({
    message: 'Date is Required'
  }),
  description: requiredString('Description'),
  category: requiredString('Category'),
  location: z.object({
    city: z.string().optional(), // z.string() is a string type
    venue: requiredString('Venue'), // z.string() is a string type
    latitude: z.coerce.number(), // z.number() is a number type
    longitude: z.coerce.number(), // z.number() is a number type
}),
});
export type ActivitySchema = z.infer<typeof activitySchema>;