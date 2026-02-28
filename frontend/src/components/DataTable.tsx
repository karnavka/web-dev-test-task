import { Table } from "antd"
import type { ColumnsType } from "antd/es/table"
import "../styles/DataTable.css";
import { useEffect, useState } from "react";

type Order = {
  id: number
  subtotal: number
  tax_amount: number
  total_amount: number
  county_name: string
  city_name: string
  state_rate: number
  county_rate: number
  city_rate: number
  special_rate: number
  composite_rate: number
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const formatPercent = (value: number) =>
  `${(value * 100).toFixed(2)}%`;

const columns: ColumnsType<Order> = [
  { title: "Order ID", dataIndex: "id", sorter: (a, b) => a.id - b.id },
  { title: "County", dataIndex: "county_name" },
  { title: "City", dataIndex: "city_name" },
  { title: "Subtotal", dataIndex: "subtotal", sorter: (a, b) => a.subtotal - b.subtotal, render: formatCurrency },
  { title: "State Rate", dataIndex: "state_rate", sorter: (a, b) => a.state_rate - b.state_rate, render: formatPercent },
  { title: "County Rate", dataIndex: "county_rate", sorter: (a, b) => a.county_rate - b.county_rate, render: formatPercent },
  { title: "City Rate", dataIndex: "city_rate", sorter: (a, b) => a.city_rate - b.city_rate, render: formatPercent },
  { title: "Special Rate", dataIndex: "special_rate", sorter: (a, b) => a.special_rate - b.special_rate, render: formatPercent },
  { title: "Composite Rate", dataIndex: "composite_rate", sorter: (a, b) => a.composite_rate - b.composite_rate, render: formatPercent },
  { title: "Tax Amount", dataIndex: "tax_amount", sorter: (a, b) => a.tax_amount - b.tax_amount, render: formatCurrency },
  { title: "Total Amount", dataIndex: "total_amount", sorter: (a, b) => a.total_amount - b.total_amount, render: formatCurrency },
]

export function DataTable({ refreshKey }: { refreshKey: number }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        const res = await fetch("http://localhost:3000/orders")
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [refreshKey])


  return (
    <div className="pageOrderTable">
    <Table
      columns={columns}
      dataSource={orders}
      pagination={{ pageSize: 7 }}
      rowKey="id"
      loading={loading}
    />
    </div>
  )
}