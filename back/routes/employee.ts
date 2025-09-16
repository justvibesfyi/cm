import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from 'zod';

const updateUserSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    avatar: z.base64(),
});

export const userRoutes = new Hono()
    .post('/update', zValidator("json", updateUserSchema), (c) => {

    })