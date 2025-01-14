'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup } from '@radix-ui/react-radio-group';
import { MapPin } from 'lucide-react';
import React, { useState } from 'react'
import { strings } from '../utils/strings';
import { Calendar } from '@/components/ui/calendar';
import { submitRSVP } from '../actions/submitRSVP';

export default function RSVPForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [accompany, setAccompany] = useState<string | null>(null);
    const [attendance, setAttendance] = useState("yes");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsloading] = useState(false);
    const { toast } = useToast();
    const { title, submitButton, thankYouMessage, eventDayLocation, emailLabel, accompanyLabel, rsvpLabel, yesOption, noOption, description, viewOnMapLabel, nameLabel, eventDateLabel, eventDate } = strings

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            setErrors({ name: "name is required" });
            return;
        }
        if (!email) {
            setErrors({ email: "email is required" });
            return;
        }

        const formData: FormData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('acompany', accompany || "0");
        formData.append('attendance', attendance);

        setIsloading(true);
        const response = await submitRSVP(formData);

        if (response.success) {
            toast({
                title: "Success",
                description: thankYouMessage
            })

            //reset the form
            setName('');
            setEmail("");
            setAccompany(null);
            setAttendance("yes");
            setErrors({});
        } else {
            toast({
                title: "Error",
                description: response.message,
                variant: "destructive"
            });
            // check if email is already submitted
        }

        if(response.error && response.error?.code === '23505'){
            setErrors({email: "email already exists or you already responded..."});
        }
        setIsloading(false);
    }
    
    const openGoogleMaps = () => {
        const encodedLocation = encodeURIComponent(eventDayLocation)
        window.open(`https://www.google.com/maps/search/?api=1query&query=${encodedLocation}`)
    }

    return (
        <div className='max-w-md mx-auto my-10'>
            <h1 className='text-2xl font-bold mb-4'>{title}</h1>
            <p className='mb-6'>{description}</p>
            <div className="mb-6">
                <Label>{eventDateLabel}</Label>
                {/* <p>{new Date(eventDate).toLocaleDateString()}</p> */}
                <Calendar
                    mode="single"
                    selected={new Date(eventDate)}
                    className='rounded-md border flex flex-col items-center'
                    fromDate={new Date(eventDate)}
                    toDate={new Date(eventDate)}
                    defaultMonth={new Date(eventDate)}
                    ISOWeek
                />
                <div className="mt-4">
                    <Button type='button' variant={"outline"} className='w-full' onClick={openGoogleMaps}>
                        <MapPin />
                        {viewOnMapLabel}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                    <Label htmlFor='name'>{nameLabel}</Label>
                    <Input
                        id='name'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    {errors.name && (
                        <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor='name'>{emailLabel}</Label>
                    <Input
                        id='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && (
                        <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor='name'>{accompanyLabel}</Label>
                    <Input
                        id='acompany'
                        value={accompany || ""}
                        onChange={e => setAccompany(e.target.value)}
                        type='number'
                        min={'0'}
                    />
                </div>
                <div>
                    <Label>{rsvpLabel}</Label>
                    <RadioGroup value={attendance} onValueChange={setAttendance}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value='yes' id='yes' />
                            <Label htmlFor='yes'>{yesOption}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value='no' id='no' />
                            <Label htmlFor='no'>{noOption}</Label>
                        </div>
                    </RadioGroup>
                </div>
                <Button disabled={isLoading} type='submit'>
                    {isLoading ? "sending" : submitButton}
                </Button>
            </form>

        </div>
    )
}
