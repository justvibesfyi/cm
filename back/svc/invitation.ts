import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { company, employee, invitation } from "../db/schema";
import { useEmail } from "./email";

const useInvitation = () => {
    return {
        createInvitation: async (
            email: string,
            company_id: number,
            created_by: string,
        ): Promise<string> => {

            const [user] = await db
                .select({ company_id: employee.company_id })
                .from(employee)
                .where(eq(employee.email, email));

            if (user && user.company_id !== null) {
                throw new Error(
                    "User already has a company or is not eligible for invitation",
                );
            }

            // Get company name for the invitation email
            const [companyData] = await db
                .select({ name: company.name })
                .from(company)
                .where(eq(company.id, company_id));

            if (!companyData) {
                throw new Error("Company not found");
            }

            const invitation_id = crypto.randomUUID();

            console.log(invitation_id);
            const expires_at = new Date();
            expires_at.setDate(expires_at.getDate() + 7);

            await db.insert(invitation).values({
                id: invitation_id,
                email,
                company_id,
                created_by,
                expires_at: expires_at.toISOString(),
            });

            // Send invitation email
            const emailService = useEmail();
            const emailResult = await emailService.sendInvitationEmail(
                email,
                companyData.name,
                invitation_id
            );

            if (!emailResult.success) {
                // Log the error but don't fail the invitation creation
                console.error("Failed to send invitation email:", emailResult);
            }

            return invitation_id;
        },

        /**
         * Gets all pending invitations for a specific company
         */
        getCompanyInvitations: async (company_id: number) => {
            const invitations = await db
                .select({
                    id: invitation.id,
                    email: invitation.email,
                    company_id: invitation.company_id,
                    created_by: invitation.created_by,
                    created_at: invitation.created_at,
                    expires_at: invitation.expires_at,
                    creator_name: employee.first_name,
                    creator_last_name: employee.last_name,
                })
                .from(invitation)
                .leftJoin(employee, eq(invitation.created_by, employee.id))
                .where(eq(invitation.company_id, company_id));

            return invitations;
        },

        /**
         * Gets all pending invitations for a specific email address
         */
        getUserInvitations: async (email: string) => {
            const invitations = await db
                .select()
                .from(invitation)
                .where(eq(invitation.email, email));

            return invitations;
        },

        /**
         * Revokes an invitation with company ownership verification
         */
        revokeInvitation: async (
            invitation_id: string,
            company_id: number,
        ): Promise<boolean> => {
            const result = await db
                .delete(invitation)
                .where(
                    and(
                        eq(invitation.id, invitation_id),
                        eq(invitation.company_id, company_id),
                    ),
                )
                .returning({ id: invitation.id });

            return result.length > 0;
        },

        /**
         * Validates an invitation token and returns invitation details if valid
         */
        validateInvitation: async (invitation_id: string) => {
            const [result] = await db
                .select()
                .from(invitation)
                .where(eq(invitation.id, invitation_id));

            if (!result) {
                return null;
            }

            // Check if invitation has expired
            const now = new Date();
            const expires_at = new Date(result.expires_at);

            if (now > expires_at) {
                // Clean up expired invitation
                await db.delete(invitation).where(eq(invitation.id, invitation_id));
                return null;
            }

            return result;
        },

        /**
         * Accepts an invitation and assigns user to company
         * This will be used during onboarding flow
         */
        acceptInvitation: async (
            invitation_id: string,
            user_id: string,
        ): Promise<boolean> => {
            const [invitationData] = await db
                .select()
                .from(invitation)
                .where(eq(invitation.id, invitation_id));

            if (!invitationData) {
                return false;
            }

            const now = new Date();
            const expires_at = new Date(invitationData.expires_at);

            if (now > expires_at) {
                await db.delete(invitation).where(eq(invitation.id, invitation_id));
                return false;
            }

            return await db.transaction(async (tx) => {
                await tx
                    .update(employee)
                    .set({ company_id: invitationData.company_id })
                    .where(eq(employee.id, user_id));

                await tx
                    .delete(invitation)
                    .where(eq(invitation.email, invitationData.email));

                return true;
            });
        },

        /**
         * Cleans up all invitations for a user (used when user gets assigned to company)
         */
        cleanupUserInvitations: async (email: string): Promise<void> => {
            await db.delete(invitation).where(eq(invitation.email, email));
        },

        /**
         * Checks if a user is eligible to receive invitations
         * User is eligible if they don't already have a company_id
         */
        isUserEligible: async (email: string): Promise<boolean> => {
            const [user] = await db
                .select({ company_id: employee.company_id })
                .from(employee)
                .where(eq(employee.email, email));

            if (!user) {
                return true;
            }

            return user.company_id === null;
        },
    };
};

export default useInvitation;
