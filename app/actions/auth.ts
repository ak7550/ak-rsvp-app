'use server';
import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

export const signIn = async (prevState: {error: string} | null, formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const supabase = await createClient();
    const {error} = await supabase.auth.signInWithPassword({
        email, password
    });

    if(error){
        return {error: error.message};
    }

    redirect("/admin/rsvps");
}

export const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}