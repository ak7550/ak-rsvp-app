'use server';

import { createClient } from "../utils/supabase/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
export const submitRSVP = async (formData: FormData) => {
    const supaBase = await createClient();
    console.log(formData);
    const name = formData.get("name");
    const email = formData.get("email");
    const acompany = formData.get("acompany");
    const attendance = formData.get("attendance");

    const { error } = await supaBase.from("rsvp").insert([
        { name, email, acompany, attendance }
    ]);

    if (error) {
        console.log(`error inserting into RSVP`, error);
        return { success: false, message: `Failed to insert into RSVP table`, error };
    }

    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: 'myown_email@random.com',
            subject: 'New RSVP submit',
            html: `
                <h1>New RSPV submission</h1>
                <p><strong>Name: </strong>${name}</p>
                <p><strong>Email: </strong>${email}</p>
                <p><strong>Number of guests: </strong>${acompany}</p>
                <p><strong>Attendance: </strong>${attendance}</p>
            `
        });
    } catch (err) {
        console.log(err);
        return {success: false, message: "No email to send to.."}
    }

    return { success: true, message: `successfully inserted into RSVP table` };
}