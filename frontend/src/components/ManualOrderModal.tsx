import { Modal, Form, InputNumber } from "antd";
import type { CreateOrderDto } from "../types/order";

const NY_BOUNDS = {
    latMin: 40.49,
    latMax: 45.01,
    lonMin: -79.76,
    lonMax: -71.85,
} as const;

type AddOrderModalProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (values: CreateOrderDto) => Promise<void> | void;
    submitting?: boolean;
};

export function AddOrderModal({ open, onClose, onCreate, submitting = false }: AddOrderModalProps) {
    const [form] = Form.useForm<CreateOrderDto>();

    const handleSubmit = async () => {
        const values = await form.validateFields(); // якщо не валідно — кинеться, і antd сам підсвітить поля
        await onCreate(values);
        form.resetFields();
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            className="orderModal"
            title="Create Order"
            open={open}
            onCancel={handleCancel}
            onOk={handleSubmit}
            okText="Create order"
            confirmLoading={submitting}
        >
            <Form layout="vertical" form={form} className="orderModal__form">
                <Form.Item
                    className="orderModal__item"
                    label="Latitude"
                    name="latitude"
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                        { required: true, message: "Latitude is required" },
                        {
                        type: "number",
                        min: NY_BOUNDS.latMin,
                        max: NY_BOUNDS.latMax,
                        message: `Must be within NY approx. (${NY_BOUNDS.latMin}…${NY_BOUNDS.latMax})`,
                        },
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
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                        { required: true, message: "Longitude is required" },
                        {
                        type: "number",
                        min: NY_BOUNDS.lonMin,
                        max: NY_BOUNDS.lonMax,
                        message: `Must be within NY approx. (${NY_BOUNDS.lonMin}…${NY_BOUNDS.lonMax})`,
                        },
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
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                        { required: true, message: "Subtotal is required" },
                        { type: "number", min: 0, max: 1_000_000, message: "Must be between 0 and 1,000,000" },
                    ]}
                >
                    <InputNumber className="orderModal__input" step={0.01} precision={2} placeholder="e.g. 157.00" />
                </Form.Item>
            </Form>
        </Modal>
    );
}