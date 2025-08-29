# Email Service Configuration

## Mailgun Integration

ChatMesh uses mailgun.js as the primary email service provider for sending authentication codes.

### Configuration

All email configuration should be managed through environment variables:

```bash
# Required Mailgun configuration
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain.com
MAILGUN_FROM_EMAIL=noreply@your_mailgun_domain.com
MAILGUN_FROM_NAME="ChatMesh"

# Optional configuration
MAILGUN_EU_REGION=false  # Set to true if using EU region
```

### Implementation Guidelines

- Use mailgun.js library for all email sending functionality
- Implement both HTML and text versions of email templates
- Include proper error handling and retry logic
- Use Mailgun's delivery tracking features for monitoring
- Single template for authentication codes only

### Email Templates

The authentication code template includes:
- Professional branding consistent with ChatMesh
- Large, clearly visible 6-digit code in both HTML and text
- Security warnings about 1-minute expiration
- Fallback text versions for accessibility
- Monospace font for code display

### Code Display Requirements

- HTML: 32px font size, bold, letter-spaced, in bordered box
- Text: Clearly labeled "Your 6-digit login code is: XXXXXX"
- Both versions must make the code easily readable
- Code expires in 1 minute (clearly communicated)

### Error Handling

- Log all email sending attempts and results
- Implement graceful fallbacks for email delivery failures
- Use Mailgun webhooks for delivery status tracking
- Provide user-friendly error messages for email issues

### Testing

- Mock Mailgun client in unit tests
- Use Mailgun's test mode for development
- Implement email preview functionality for template testing
- Test both HTML and text email rendering