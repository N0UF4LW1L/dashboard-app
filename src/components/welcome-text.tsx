'use client';

import { useUser } from '@/context/user-context';
import React from 'react';

const Welcome = () => {
    const { user } = useUser();
    return (
        <h2 className="text-3xl font-bold tracking-tight">
            Halo {user?.name}, Selamat datang kembali 👋
        </h2>
    );
};

export default Welcome;
