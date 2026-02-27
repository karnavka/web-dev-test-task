import { Modal, Form, InputNumber } from "antd";
import type { CreateOrderDto } from "../types/order";

type AddOrderModalProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (values: CreateOrderDto) => Promise<void> | void;
    submitting?: boolean;
};

export function AddOrderModal({ open, onClose, onCreate, submitting = false }: AddOrderModalProps) {
    const [form] = Form.useForm<CreateOrderDto>();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onCreate(values);
        } catch {
            // validation errors
        }
    };

    return (
        <Modal
            className="orderModal"
            title="Create Order"
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            okText="Create order"
            confirmLoading={submitting}
            destroyOnClose
        >
            <Form layout="vertical" form={form} className="orderModal__form">
                <Form.Item
                    className="orderModal__item"
                    label="Latitude"
                    name="latitude"
                    rules={[
                        { required: true, message: "Latitude is required" },
                        { type: "number", min: -90, max: 90, message: "Must be between -90 and 90" },
                    ]}
                >
                    <InputNumber
                        className="orderModal__input"
                        step={0.000001}
                        precision={6}
                        placeholder="e.g. 40.7128"
                    />
                </Form.Item>

                <Form.Item
                    className="orderModal__item"
                    label="Longitude"
                    name="longitude"
                    rules={[
                        { required: true, message: "Longitude is required" },
                        { type: "number", min: -180, max: 180, message: "Must be between -180 and 180" },
                    ]}
                    >
                    <InputNumber
                        className="orderModal__input"
                        step={0.000001}
                        precision={6}
                        placeholder="e.g. -74.0060"
                    />
                </Form.Item>

                <Form.Item
                    className="orderModal__item"
                    label="Subtotal"
                    name="subtotal"
                    rules={[
                        { required: true, message: "Subtotal is required" },
                        { type: "number", min: 0, message: "Must be 0 or greater" },
                    ]}
                    >
                    <InputNumber
                        className="orderModal__input"
                        min={0}
                        step={0.01}
                        precision={2}
                        placeholder="e.g. 157.00"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}