import { z } from 'zod';

const requiredString = (fieldName: string) => z
.string({required_error:`${fieldName} is required`})
.min(1, {message: `${fieldName} is required`});

export const activitySchema = z.object({ 
    title: requiredString('Title'), // z.string() is a string type
    category: requiredString('Category'), // z.string() is a string type
    description: requiredString('Description'), // z.string() is a string type
    date: requiredString('Date'), // z.string() is a string type
    city: requiredString('City'), // z.string() is a string type
    venue: requiredString('Venue'), // z.string() is a string type
});

export type ActivitySchema = z.infer<typeof activitySchema>; // z.infer() is a type inference function