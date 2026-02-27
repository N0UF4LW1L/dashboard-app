'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Spinner from '@/components/spinner';
import { Car, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useVehiclesStatusCount } from '@/hooks/api/use-vehicle';

const VehicleStatusCard = () => {
    const { data: statusCount, isFetching } = useVehiclesStatusCount();
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
                    <Link href="/dashboard/vehicles">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tersedia</CardTitle>
                                <CheckCircle />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{count?.[0].count ?? '0'}</div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/dashboard/vehicles">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tidak Tersedia</CardTitle>
                                <XCircle />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{count?.[1].count ?? 0}</div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/dashboard/vehicles">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Kendaraan</CardTitle>
                                <Car />
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

export default VehicleStatusCard;
