import { useState } from "react";
import { AddOrderAction } from "../components/AddOrderAction";
import { AddOrderModal } from "../components/ManualOrderModal";
import { CVSUploadAction } from "../components/CVSUploadAction";
import { DataTable } from "../components/DataTable"
import type { CreateOrderDto } from "../types/order";
import "../styles/OrdersPage.css";
import "../styles/AddOrderModal.css";


export function OrdersPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenModal = () => setIsCreateModalOpen(true);

    const handleCreate = async (values: CreateOrderDto) => {
        setIsSubmitting(true);
        try {
            // await createOrder(values);
            console.log(values);
            setIsCreateModalOpen(false);
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
                    {/* <CsvImportAction uploading={false} onUpload={(file) => {}} /> */}
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
                
                {/* <div className="pageOrderTable"> <OrdersTable />  </div>  */}
            </div>
        </>
    );
}