import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs"; 
import User from "../model/userModel";

export async function sendMail(email: string, userId: any) {
    try {
        // Create a token to send
        const hashedToken = await bcryptjs.hash(userId.toString(), 20);

        // Update user with verifyToken and expiry
        await User.findByIdAndUpdate(userId.toString(), {
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
        });

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service (e.g., 'gmail')
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS,  // Your email password
            }
        });

        // Define mail options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: email,   // Recipient address
            subject: "Verify your email",
            html: `
                <p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to verify your email
                or copy and paste the link below into your browser:</p>
                <p><strong>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</strong></p>
            `
        };

        // Send the email
        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully:", mailResponse.response);
        
        return mailResponse;
    } catch (error: any) {
        console.error("Error sending mail:", error.message);
        throw new Error(error.message);
    }
}
