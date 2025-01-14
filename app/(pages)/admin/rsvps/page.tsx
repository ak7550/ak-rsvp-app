"use server";

import RSPVTable from "@/app/_componenets/RSPVTable";
import { signOut } from "@/app/actions/auth";
import { getRSVPs } from "@/app/actions/getRSVPs";
import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import Link from "next/link";

export default async function RSVPspage() {
    const {success, data, message} = await getRSVPs();

    if(!success){
        return (
            <div className="container mx-auto mt-8 p-4">Error: {message}</div>
        )
    }
    
    // if not authenticated, redirect to log in page
    return (
        <div className="container mx-auto m-8 p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-black">All RSPVs</h1>
                    <div className="flex items-center gap-2">
                        <Link href="/">
                        <Button variant="outline">
                            <House />
                        </Button>
                        </Link>
                        {/* add log out button */}
                        <form action={signOut}>
                            <Button variant={"outline"}>Sign Out</Button>
                        </form>
                    </div>
            </div>
            <RSPVTable data={data || []} />
        </div>
    )

}