import type { CreateOrderDto } from "../types/order";

export const createOrder = async (dto: CreateOrderDto) => {
    const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(data?.error || "Server error");
    }

    return data;
};