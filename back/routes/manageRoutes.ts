import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { z } from 'zod';

// Middleware to check authentication
const requireAuth = async (c: any, next: any) => {
    const sessionId = getCookie(c, 'session');

    if (!sessionId) {
        return c.json({ error: 'Authentication required' }, 401);
    }

    // TODO: Validate session with database
    // For now, just check if session exists

    await next();
};

// Source of truth
const businessSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string()
});

const integrationSchema = z.object({
    id: z.string(),
    businessId: z.string(),
    platform: z.enum(['telegram', 'zalo']),
    clientId: z.string().optional(),
    secret: z.string()
});

// Validation schemas
const platformSchema = integrationSchema.pick({
    platform: true,
})

const integrationUpdateSchema = integrationSchema.pick({
    platform: true,
    clientId: true,
    secret: true
}).partial();

const businessUpdateSchema = businessSchema.pick({
    name: true,
    description: true,
    icon: true
}).partial({
    icon: true
});


// POST /api/manage/integrations/enable
export const manageRoutes = new Hono()
    .post('/integrations/enable',
        zValidator('json', platformSchema),
        async (c) => {
            const { platform } = c.req.valid('json');

            // TODO: Enable integration in database
            console.log(`Enabling integration for platform: ${platform}`);

            return c.json({
                message: `${platform} integration enabled successfully`,
                platform,
                enabled: true
            });
        })

    // POST /api/manage/integrations/disable
    .post('/integrations/disable',
        zValidator('json', platformSchema),
        async (c) => {
            const { platform } = c.req.valid('json');

            // TODO: Disable integration in database
            console.log(`Disabling integration for platform: ${platform}`);

            return c.json({
                message: `${platform} integration disabled successfully`,
                platform,
                enabled: false
            });
        })

    // PUT /api/manage/integrations/update
    .put('/integrations/update',
        zValidator('json', integrationUpdateSchema),
        async (c) => {
            try {
                const { platform, clientId } = c.req.valid('json');

                // TODO: Update integration credentials in database
                console.log(`Updating integration for platform: ${platform}`);

                return c.json({
                    message: `${platform} integration updated successfully`,
                    integration: {
                        platform,
                        clientId: clientId || null,
                        secret: '***', // Don't return actual secret
                        updatedAt: new Date().toISOString()
                    }
                });

            } catch (error) {
                console.error(`Error updating integration: ${error}`);
                return c.json({ error: 'Failed to update integration' }, 500);
            }
        })

    // Business Management Routes

    // PUT /api/manage/business/update
    .put('/business/update',
        zValidator('json', businessUpdateSchema),
        async (c) => {
            try {
                const { name, description, icon } = c.req.valid('json');

                // TODO: Update business information in database
                console.log('Updating business information');

                return c.json({
                    message: 'Business information updated successfully',
                    business: {
                        name: name || null,
                        description: description || null,
                        icon: icon ? 'Updated' : null, // Don't return actual image data
                        updatedAt: new Date().toISOString()
                    }
                });

            } catch (error) {
                console.error(`Error updating business: ${error}`);
                return c.json({ error: 'Failed to update business information' }, 500);
            }
        })

    // GET /api/manage/integrations
    .get('/integrations', async (c) => {
        const integrations = [
            {
                platform: 'telegram',
                enabled: true,
                hasCredentials: false,
                lastSync: null
            },
            {
                platform: 'zalo',
                enabled: false,
                hasCredentials: false,
                lastSync: null
            }
        ];

        return c.json({ integrations });
    });