import { useState } from "react";
import { message } from "antd";

import { AddOrderAction } from "../components/AddOrderAction";
import { AddOrderModal } from "../components/ManualOrderModal";
import { CVSUploadAction } from "../components/CVSUploadAction";
import { DataTable } from "../components/DataTable"

import type { CreateOrderDto } from "../types/order";
import { createOrder } from "../services/orders";

import "../styles/OrdersPage.css";
import "../styles/AddOrderModal.css";


export function OrdersPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [msgApi, contextHolder] = message.useMessage();

    const handleOpenModal = () => setIsCreateModalOpen(true);

    const handleCreate = async (values: CreateOrderDto) => {
        setIsSubmitting(true);
        try {
            const created = await createOrder(values);
            msgApi.success("Order created");
            setIsCreateModalOpen(false);
            handleRefresh();
        } catch (e: unknown) {
            msgApi.error(getErrorMessage(e));
        } finally {
            setIsSubmitting(false);
        }
    };

    const [refreshKey, setRefreshKey] = useState(0)

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <>
            {contextHolder}
            <div className="appBackground" />
            <div className="pageContainer">
                {/* Header */}
                <header className="pageHeader">
                    <h1 className="pageHeader__title">Instant Wellness Kits</h1>
                    <p className="pageHeader__subtitle">Save your day</p>
                </header>

                {/* Actions */}
                <div className="pageActions">
                    <AddOrderAction onAdd={handleOpenModal} className="pageActions__addButton">
                        Add order manually
                    </AddOrderAction>
                </div>

                
                <AddOrderModal
                    open={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreate}
                    submitting={isSubmitting}
                />

                {/*File Uploader*/}
                <CVSUploadAction onFileSelect={handleRefresh} />
                <DataTable refreshKey={refreshKey} />
            </div>
        </>
    );
}

const getErrorMessage = (e: unknown) => {
    const msg = e instanceof Error ? e.message : String(e ?? "");
    const lower = msg.toLowerCase();

    if (msg.includes("Not NY")) {
        return "Orders are allowed only within New York state.";
    }

    if (lower.includes("timed out") || lower.includes("timeout")) {
        return "Server is not responding. Please try again.";
    }

    return msg || "Failed to create order. Please try again.";
};
