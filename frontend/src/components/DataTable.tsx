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
}

const columns: ColumnsType<Order> = [
  {
    title: "Order ID",
    dataIndex: "id",
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: "County",
    dataIndex: "county_name",
  },
  {
    title: "City",
    dataIndex: "city_name",
  },
  {
    title: "Subtotal",
    dataIndex: "subtotal",
    sorter: (a, b) => a.subtotal - b.subtotal,
  },
  {
    title: "Tax",
    dataIndex: "tax_amount",
    sorter: (a, b) => a.tax_amount - b.tax_amount,
  },
  {
    title: "Total",
    dataIndex: "total_amount",
    sorter: (a, b) => a.total_amount - b.total_amount,
  },
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