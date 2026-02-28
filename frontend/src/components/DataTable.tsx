import { Table } from "antd"
import type { ColumnsType } from "antd/es/table"
import "../styles/DataTable.css";

type Order = {
  id: number
  longitude: number
  latitude: number
  country: string
  date: number
  subtotal: number
  tax: number
  total: number
}

const columns: ColumnsType<Order> = [
  {
    title: "Order ID",
    dataIndex: "id",
    key: "id",
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: "Longitude",
    dataIndex: "longitude",
    key: "longitude",
  },
  {
    title: "Latitude",
    dataIndex: "latitude",
    key: "latitude",
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
    filters: [
      { text: "USA", value: "USA" },
      { text: "Canada", value: "Canada" },
    ],
    onFilter: (value, record) => record.country === value,
  },
  {
  title: "Date",
  dataIndex: "date",
  key: "date",
  sorter: (a, b) => a.date - b.date,
  render: (value: number) =>
    new Date(value).toLocaleString(),
  },
  {
    title: "Subtotal",
    dataIndex: "subtotal",
    key: "subtotal",
    sorter: (a, b) => a.subtotal - b.subtotal,
  },
  {
    title: "Tax",
    dataIndex: "tax",
    key: "tax",
    sorter: (a, b) => a.tax - b.tax,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    sorter: (a, b) => a.total - b.total,
  },
]

function parseBackendDate(date: string): number {
  return new Date(date.replace(" ", "T")).getTime()
}

const mockData: Order[] = [
  {
    id: 1,
    longitude: -78.86718664,
    latitude: 42.01246326,
    country: "New York",
    date: parseBackendDate("2025-11-04 10:17:05"),
    subtotal: 120,
    tax: 18,

    total: 138,
  },
  {
    id: 2,
    longitude: -74.86718664,
    latitude: 43.01246326,
    country: "New York",
    date: parseBackendDate("2025-11-03 10:17:05"),
    subtotal: 130,
    tax: 17,
    total: 147,
  },
  {
    id: 3,
    longitude: -74.86718664,
    latitude: 43.01246326,
    country: "New York",
    date: parseBackendDate("2025-11-03 10:17:05"),
    subtotal: 130,
    tax: 17,
    total: 147,
  },
  {
    id: 4,
    longitude: -74.86718664,
    latitude: 43.01246326,
    country: "New York",
    date: parseBackendDate("2025-11-03 10:17:05"),
    subtotal: 130,
    tax: 17,
    total: 147,
  },
  {
    id: 5,
    longitude: -74.86718664,
    latitude: 43.01246326,
    country: "New York",
    date: parseBackendDate("2025-11-03 10:17:05"),
    subtotal: 130,
    tax: 17,
    total: 147,
  },
  {
    id: 6,
    longitude: -74.86718664,
    latitude: 43.01246326,
    country: "New York",
    date: parseBackendDate("2025-11-03 10:17:05"),
    subtotal: 130,
    tax: 17,
    total: 147,
  },
  {
    id: 7,
    longitude: -74.86718664,
    latitude: 43.01246326,
    country: "New York",
    date: parseBackendDate("2025-11-03 10:17:05"),
    subtotal: 130,
    tax: 17,
    total: 147,
  },
  {
    id: 8,
    longitude: -74.86718664,
    latitude: 43.01246326,
    country: "New York",
    date: parseBackendDate("2025-11-03 10:17:05"),
    subtotal: 130,
    tax: 17,
    total: 147,
  },
  {
    id: 9,
    longitude: -74.86718664,
    latitude: 43.01246326,
    country: "New York",
    date: parseBackendDate("2025-11-03 10:17:05"),
    subtotal: 130,
    tax: 17,
    total: 147,
  },
]

export function DataTable() {
  return (
    <div className="pageOrderTable">
    <Table
      columns={columns}
      dataSource={mockData}
      pagination={{ pageSize: 7 }}
      rowKey="id"
    />
    </div>
  )
}