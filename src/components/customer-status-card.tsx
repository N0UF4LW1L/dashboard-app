'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Spinner from '@/components/spinner';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { useCustomersStatusCount } from '@/hooks/api/use-customer';

const CustomerStatusCard = () => {
    const { data: statusCount, isFetching } = useCustomersStatusCount();
    const count = statusCount?.data;

    return (
        <>
            {isFetching && (
                <div className="absolute w-full">
                    <Spinner />
                </div>
            )}
            {!isFetching && count && (
                <>
                    <Link href="/dashboard/customers">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Customer</CardTitle>
                                <Users />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{count?.[0].count ?? '0'}</div>
                            </CardContent>
                        </Card>
                    </Link>
                </>
            )}
        </>
    );
};

export default CustomerStatusCard;
