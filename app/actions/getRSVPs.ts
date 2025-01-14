import { createClient } from "../utils/supabase/server"

export const getRSVPs = async () => {
    const supabase = await createClient();
    const {data, error} = await supabase.from('rsvp').select("*");

    if(error){
        console.log(error);
        return {success: false, message: 'failed to fetch RSVPs'};
    }

    return {success: true, data};
}