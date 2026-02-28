import { InboxOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { Upload, message } from "antd"

const { Dragger } = Upload

type CsvImportProps = {
  onFileSelect: (file: File) => void
}

export function CVSUploadAction({ onFileSelect }: CsvImportProps) {
  const props: UploadProps = {
    multiple: false,

    beforeUpload: (file) => {
      const isCsv = file.type === "text/csv"

      if (!isCsv) {
        message.error("Only CSV files are allowed")
        return Upload.LIST_IGNORE
      }

      onFileSelect(file)

      return false
    },
  }

  return (
    <Dragger {...props} style={{ padding: 20 }}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag CSV file to this area
      </p>
      <p className="ant-upload-hint">
        Only .csv format is supported
      </p>
    </Dragger>
  )
}