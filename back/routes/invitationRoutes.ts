import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import useInvitation from "../svc/invitation";
import requiresAuth from "./middleware/requiresAuth";

// Validation schemas
const invitationCreateSchema = z.object({
    email: z.email().max(255),
});

const acceptInvitationSchema = z.object({
    invitation_id: z.string(),
});

const invitationRevokeSchema = z.object({
    id: z.string(),
});

export const invitationRoutes = new Hono()
    .use("*", requiresAuth)

    // Create invitation (for company managers)
    .post("/invite", zValidator("json", invitationCreateSchema), async (c) => {
        const company_id = c.var.user.company_id;

        if (company_id === null) {
            return c.json({ error: "You're not in a company" }, 400);
        }

        const { email } = c.req.valid("json");

        try {
            const invitation = useInvitation();

            await invitation.createInvitation(
                email,
                company_id,
                c.var.user.id
            );

            return c.json({ success: true });
        } catch (error) {
            console.error("Failed to create invitation:", error);
            return c.json({ error: "Failed to create invitation" }, 500);
        }
    })

    // Get company invitations (for company managers)
    .get("/", async (c) => {
        const company_id = c.var.user.company_id;

        if (company_id === null) {
            return c.json({ error: "You're not in a company" }, 400);
        }

        try {
            const invitation = useInvitation();
            const invitations = await invitation.getCompanyInvitations(company_id);

            return c.json({ invitations });
        } catch (error) {
            console.error("Failed to get invitations:", error);
            return c.json({ error: "Failed to get invitations" }, 500);
        }
    })

    // Revoke invitation (for company managers)
    .delete(
        "/:id",
        zValidator("param", invitationRevokeSchema),
        async (c) => {
            const company_id = c.var.user.company_id;

            if (company_id === null) {
                return c.json({ error: "You're not in a company" }, 400);
            }

            const { id } = c.req.valid("param");

            try {
                const invitation = useInvitation();
                const success = await invitation.revokeInvitation(id, company_id);

                if (!success) {
                    return c.json({ error: "Invitation not found or not authorized" }, 404);
                }

                return c.json({ success: true });
            } catch (error) {
                console.error("Failed to revoke invitation:", error);
                return c.json({ error: "Failed to revoke invitation" }, 500);
            }
        },
    )

    // Get user's pending invitations (for onboarding)
    .get("/my-invitations", async (c) => {
        const invitation = useInvitation();
        const userEmail = c.var.user.email;

        try {
            const invitations = await invitation.getUserInvitations(userEmail);

            // Filter out expired invitations
            const validInvitations = [];
            const now = new Date();

            for (const inv of invitations) {
                const expiresAt = new Date(inv.expires_at);
                if (now <= expiresAt) {
                    validInvitations.push(inv);
                }
            }

            return c.json({ invitations: validInvitations });
        } catch (error) {
            console.error("Failed to get user invitations:", error);
            return c.json({ error: "Failed to retrieve invitations" }, 500);
        }
    })

    // Accept invitation (for onboarding)
    .post("/accept", zValidator("json", acceptInvitationSchema), async (c) => {
        const { invitation_id } = c.req.valid("json");
        const invitation = useInvitation();
        const userId = c.var.user.id;

        try {
            // Check if user already has a company
            if (c.var.user.company_id !== null) {
                return c.json({ error: "You are already assigned to a company" }, 400);
            }

            const success = await invitation.acceptInvitation(invitation_id, userId);

            if (!success) {
                return c.json({ error: "Invalid or expired invitation" }, 404);
            }

            return c.json({ success: true });
        } catch (error) {
            console.error("Failed to accept invitation:", error);
            return c.json({ error: "Failed to accept invitation" }, 500);
        }
    });