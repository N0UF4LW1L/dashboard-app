'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Spinner from '@/components/spinner';
import { Clock3, Activity } from 'lucide-react';
import Link from 'next/link';
import { useOrdersStatusCount } from '@/hooks/api/use-order';

const OrderStatusCard = () => {
    const { data: statusCount, isFetching } = useOrdersStatusCount();
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
                    <Link
                        href={{
                            pathname: '/dashboard/orders',
                            query: { status: 'Belum Lunas' },
                        }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Belum Lunas</CardTitle>
                                <Clock3 />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{count?.[0].count ?? '0'}</div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link
                        href={{
                            pathname: '/dashboard/orders',
                            query: { status: 'Lunas' },
                        }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Lunas</CardTitle>
                                <Activity />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{count?.[1].count ?? 0}</div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/dashboard/orders">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
                                <Activity />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{count?.[2].count ?? 0}</div>
                            </CardContent>
                        </Card>
                    </Link>
                </>
            )}
        </>
    );
};

export default OrderStatusCard;
