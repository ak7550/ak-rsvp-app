"use client";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMemo, useState } from 'react';

interface RSPVData {
    id: string;
    name: string;
    email: string;
    acompany: string;
    attendance: string;
}

interface RSPVTableProps {
    data: RSPVData[];
}

export default function RSPVTable({ data }: RSPVTableProps) {
    const [filter, setFilter] = useState("");
    const filteredData: RSPVData[] = useMemo(
        () => data.filter(rspv => rspv.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())),
    [data, filter]);

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder='filter by name..'
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className='max-w-sm'
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Number of Guests</TableHead>
                            <TableHead>Attending</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map(({ name, email, acompany, attendance, id }) => (
                                <TableRow key={id}>
                                    <TableCell>{name}</TableCell>
                                    <TableCell>{email}</TableCell>
                                    <TableCell>{acompany || "/"}</TableCell>
                                    <TableCell>{attendance}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className='h-24 text-center'>
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
