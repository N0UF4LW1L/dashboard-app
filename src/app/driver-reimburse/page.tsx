"use client";

import "./styles.css";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select as AntdSelect } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { z } from "zod";
import Spinner from "@/components/spinner";
import { apiClient } from "@/lib/api-client";
import UploadFile from "@/components/upload-file";

const { Option } = AntdSelect;

// Schema validation
const formSchema = z.object({
    driver_name: z.string().min(1, { message: "Driver harus dipilih" }),
    code: z.string().min(1, { message: "Task harus dipilih" }),
    transaction_proof_url: z.string().url({ message: "URL bukti transaksi tidak valid" }).min(1, { message: "Bukti transaksi harus diupload" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function DriverReimbursePage() {
    const [loading, setLoading] = useState(false);
    const [uploadKey, setUploadKey] = useState(0);

    // Search terms
    const [searchDriverTerm, setSearchDriverTerm] = useState("");

    // Debounced search
    const [searchDriverDebounce] = useDebounce(searchDriverTerm, 500);

    // Data states
    const [drivers, setDrivers] = useState<any[]>([]);
    const [reimburseTasks, setReimburseTasks] = useState<any[]>([]);

    // Loading states
    const [loadingDrivers, setLoadingDrivers] = useState(false);
    const [loadingTasks, setLoadingTasks] = useState(false);

    const defaultValues: Partial<FormValues> = {
        driver_name: "",
        code: "",
        transaction_proof_url: "",
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const selectedDriverName = form.watch("driver_name");

    const fetchDrivers = async (search: string = "") => {
        try {
            setLoadingDrivers(true);
            const response = await apiClient.get("/reimburses/form/drivers", {
                params: { q: search },
            });

            let driversData = response.data?.data?.items || [];
            if (!Array.isArray(driversData)) driversData = [];

            const validDrivers = driversData.filter((driver: any) => driver && driver.name);
            setDrivers(validDrivers);
        } catch (error: any) {
            console.error("Error fetching drivers:", error);
            toast.error("Error", {
                description: error.response?.data?.message || "Gagal memuat data driver",
            });
            setDrivers([]);
        } finally {
            setLoadingDrivers(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    useEffect(() => {
        if (searchDriverDebounce !== undefined) {
            fetchDrivers(searchDriverDebounce);
        }
    }, [searchDriverDebounce]);

    const fetchReimburseTasks = async (driverName: string) => {
        if (!driverName) {
            setReimburseTasks([]);
            form.setValue("code", "");
            return;
        }

        try {
            setLoadingTasks(true);
            const codesResponse = await apiClient.get(`/reimburses/form/drivers/${encodeURIComponent(driverName)}/tasks`);

            let codesData = codesResponse.data?.data || [];
            if (!Array.isArray(codesData)) codesData = [];

            const safeTasks = codesData
                .filter((task: any) => task && task.unique_code != null)
                .map((task: any) => ({
                    unique_code: String(task.unique_code || ''),
                    description: String(task.description || ''),
                }));

            setReimburseTasks(safeTasks);
            if (safeTasks.length === 0) {
                form.setValue("code", "");
            }
        } catch (error: any) {
            console.error("Error fetching reimburse tasks:", error);
            toast.error("Error", {
                description: error.response?.data?.message || "Gagal memuat data reimburse",
            });
            setReimburseTasks([]);
            form.setValue("code", "");
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        if (selectedDriverName && typeof selectedDriverName === 'string') {
            fetchReimburseTasks(selectedDriverName);
        } else {
            setReimburseTasks([]);
            form.setValue("code", "");
        }
    }, [selectedDriverName]);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);

        try {
            if (!data.transaction_proof_url) {
                toast.error("Error", {
                    description: "Bukti transaksi harus diupload",
                });
                setLoading(false);
                return;
            }

            const payload = {
                code: data.code,
                transaction_proof_url: data.transaction_proof_url,
            };

            await apiClient.post("/reimburses/form/submit-code", payload);

            toast.success("✓ Pengajuan Reimburse Berhasil", {
                description: "Bukti transaksi Anda telah berhasil dikirim. Pengajuan reimburse sedang dalam proses peninjauan.",
            });

            form.reset({
                driver_name: "",
                code: "",
                transaction_proof_url: "",
            });

            setUploadKey(prev => prev + 1);
            setReimburseTasks([]);
            setSearchDriverTerm("");

            setTimeout(() => {
                form.setValue("driver_name", "");
                form.setValue("code", "");
            }, 100);

            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error("❌ Error!", {
                description: error.response?.data?.message || "Gagal menyimpan bukti transaksi",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center animate-in fade-in zoom-in duration-300">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 mx-auto">
                                <Spinner className="h-20 w-20 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Mengirim Data...
                        </h3>
                        <p className="text-sm text-gray-600">
                            Mohon tunggu, sedang memproses reimburse Anda
                        </p>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-3 sm:p-5 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 sm:mb-8">
                        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border-t-4 border-blue-600">
                            <Heading
                                title="📝 Reimburse Driver"
                                description="Form pengajuan reimburse untuk driver Transgo"
                            />
                        </div>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-3 sm:space-y-4"
                        >
                            {/* Driver */}
                            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
                                <FormField
                                    name="driver_name"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="relative label-required text-base font-semibold text-gray-700">
                                                Nama Pengemudi
                                            </FormLabel>
                                            <FormControl>
                                                <AntdSelect
                                                    {...field}
                                                    className="w-full"
                                                    showSearch
                                                    placeholder="Pilih pengemudi..."
                                                    style={{ height: "48px" }}
                                                    size="large"
                                                    onSearch={setSearchDriverTerm}
                                                    onChange={(value: any) => {
                                                        field.onChange(value || "");
                                                    }}
                                                    onClear={() => {
                                                        field.onChange("");
                                                        setSearchDriverTerm("");
                                                        setReimburseTasks([]);
                                                    }}
                                                    allowClear
                                                    filterOption={false}
                                                    loading={loadingDrivers}
                                                    value={field.value ? field.value : undefined}
                                                >
                                                    {Array.isArray(drivers) && drivers
                                                        .filter((driver) => !!driver?.name)
                                                        .map((driver, idx) => (
                                                            <Option key={idx} value={driver.name}>
                                                                {driver.name}
                                                            </Option>
                                                        ))
                                                    }
                                                </AntdSelect>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Code / Task Dropdown */}
                            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="relative label-required text-base font-semibold text-gray-700">
                                                Task / Reimburse
                                            </FormLabel>
                                            <FormControl>
                                                <AntdSelect
                                                    {...field}
                                                    className="w-full"
                                                    placeholder={
                                                        !selectedDriverName
                                                            ? "Pilih driver terlebih dahulu"
                                                            : loadingTasks
                                                                ? "Memuat task..."
                                                                : reimburseTasks.length === 0
                                                                    ? "Tidak ada task / reimburse"
                                                                    : "Pilih task / reimburse"
                                                    }
                                                    style={{ height: "48px" }}
                                                    size="large"
                                                    onChange={field.onChange}
                                                    value={field.value || undefined}
                                                    disabled={!selectedDriverName || loadingTasks}
                                                    loading={loadingTasks}
                                                    notFoundContent={
                                                        reimburseTasks.length === 0 && selectedDriverName && !loadingTasks
                                                            ? "Tidak ada task / reimburse"
                                                            : null
                                                    }
                                                >
                                                    {Array.isArray(reimburseTasks) && reimburseTasks
                                                        .filter((task) => !!task?.unique_code)
                                                        .map((task) => (
                                                            <Option key={task.unique_code} value={task.unique_code}>
                                                                {task.description || task.unique_code}
                                                            </Option>
                                                        ))
                                                    }
                                                </AntdSelect>
                                            </FormControl>
                                            <FormMessage />
                                            {selectedDriverName && reimburseTasks.length === 0 && !loadingTasks && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Tidak ada task / reimburse yang tersedia untuk driver ini
                                                </p>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* File Upload */}
                            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
                                <FormField
                                    control={form.control}
                                    name="transaction_proof_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="relative label-required text-base font-semibold text-gray-700 pb-2 block">
                                                Bukti Transaksi
                                            </FormLabel>
                                            <FormControl>
                                                <UploadFile
                                                    key={uploadKey}
                                                    initialData={null}
                                                    form={form}
                                                    name={field.name}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all p-4 sm:p-6">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 text-base sm:text-lg font-bold bg-white text-blue-600 hover:bg-gray-50"
                                >
                                    {loading ? <Spinner className="h-5 w-5 mr-2" /> : null}
                                    {loading ? "Mengirim..." : "✓ Submit Reimburse"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
            <Toaster />
        </>
    );
}
