import nodemailer from 'nodemailer';

interface MailOptions {
    email: string;
    subject: string;
    html: string;
}

// Validate environment variables on startup
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS_2) {
    console.error('[v0] ERROR: EMAIL_USER and EMAIL_PASS_2 environment variables are required for password reset feature');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS_2,
    },
});

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
    try {
        // Validate credentials before attempting to send
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS_2) {
            console.error('[v0] Email credentials not configured. Set EMAIL_USER and EMAIL_PASS_2 environment variables.');
            return false;
        }

        const mailOptions: MailOptions = {
            email,
            subject: 'Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>You requested to reset your password. Please use the following OTP to proceed:</p>
                    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #333; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    <p>This OTP is valid for 10 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
                    <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply to this email.</p>
                </div>
            `,
        };

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: mailOptions.email,
            subject: mailOptions.subject,
            html: mailOptions.html,
        });

        console.log(`[v0] OTP email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('[v0] Error sending email:', error);
        return false;
    }
};
