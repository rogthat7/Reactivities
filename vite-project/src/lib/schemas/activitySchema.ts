import { z } from 'zod';

const requiredString = (fieldName: string) => z
.string({required_error:`${fieldName} is required`})
.min(1, {message: `${fieldName} is required`});

export const activitySchema = z.object({ 
    title: requiredString('Title'), // z.string() is a string type
    category: requiredString('Category'), // z.string() is a string type
    description: requiredString('Description'), // z.string() is a string type
    date: z.coerce.date({
        message: 'Invalid date format',
    }), // z.date() is a date type
    location: z.object({
        city: z.string().optional(), // z.string() is a string type
        venue: requiredString('Venue'), // z.string() is a string type
        latitude: z.coerce.number(), // z.number() is a number type
        longitude: z.coerce.number(), // z.number() is a number type
    }), 
});

export type ActivitySchema = z.infer<typeof activitySchema>; // z.infer() is a type inference function