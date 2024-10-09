
import { otpSetData } from "../services/redisClient";
import generateOTP from "../services/generateOTP";
import { sendMail } from "../services/sendMail";

interface SendOtpParams {
    email: string;
    name: string;
}

export const sendOtp = async ({ email, name }: SendOtpParams): Promise<string> => {
    try {
        const otp: string = generateOTP();
        const subject: string = "OTP Verification";
        const text: string = `Hello ${name},\n\nThank you for registering with VoyaGo!, your OTP is ${otp}\n\nHave a nice day!!!`;
        await sendMail(email, subject, text);
        await otpSetData(email, otp);
        console.log("OTP sent:", otp); 
        return 'success'
    } catch (error) {
        console.error("Error sending OTP:", error);
        return "Failed to send OTP.";
    }
};