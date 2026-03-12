import BreadCrumb from '@/components/breadcrumb';
import { AddonForm } from '../_components/addon-form';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Addons', link: '/dashboard/addons' },
    { title: 'Create', link: '/dashboard/addons/create' },
];

export default function page() {
    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            <AddonForm initialData={null} />
        </div>
    );
}
