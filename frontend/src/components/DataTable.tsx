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

const columns: ColumnsType<Order> = [
  { title: "Order ID", dataIndex: "id", sorter: (a, b) => a.id - b.id },
  { title: "County", dataIndex: "county_name" },
  { title: "City", dataIndex: "city_name" },
  { title: "Subtotal", dataIndex: "subtotal", sorter: (a, b) => a.subtotal - b.subtotal },
  { title: "State Rate", dataIndex: "state_rate", sorter: (a, b) => a.state_rate - b.state_rate },
  { title: "County Rate", dataIndex: "county_rate", sorter: (a, b) => a.county_rate - b.county_rate },
  { title: "City Rate", dataIndex: "city_rate", sorter: (a, b) => a.city_rate - b.city_rate },
  { title: "Special Rate", dataIndex: "special_rate", sorter: (a, b) => a.special_rate - b.special_rate },
  { title: "Composite Rate", dataIndex: "composite_rate", sorter: (a, b) => a.composite_rate - b.composite_rate },
  { title: "Tax Amount", dataIndex: "tax_amount", sorter: (a, b) => a.tax_amount - b.tax_amount },
  { title: "Total Amount", dataIndex: "total_amount", sorter: (a, b) => a.total_amount - b.total_amount },
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