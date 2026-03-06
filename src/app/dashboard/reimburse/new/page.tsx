import BreadCrumb from '@/components/breadcrumb';
import { ReimburseForm } from '../_components/reimburse-form';

export const metadata = {
    title: 'Dashboard : Tambah Reimburse',
};

export default function Page() {
    const breadcrumbItems = [
        { title: 'Reimburse', link: '/dashboard/reimburse' },
        { title: 'Pengambilan', link: '/dashboard/reimburse/new' },
    ];

    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            <ReimburseForm initialData={null} />
        </div>
    );
}
