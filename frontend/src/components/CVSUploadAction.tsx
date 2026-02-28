import { InboxOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { Upload, message } from "antd"
import "../styles/CVSUploadAction.css";

const { Dragger } = Upload

type CsvImportProps = {
  onFileSelect: (file: File) => void
}

export function CVSUploadAction({ onFileSelect }: CsvImportProps) {
  const props: UploadProps = {
    multiple: false,

    beforeUpload: async (file) => {
      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        message.success("File uploaded successfully")

        onFileSelect(file)

    } catch (error) {
      message.error("Upload failed")
    }
      return false
    } 
  }

  return (
    <div className="csvUpload">
    <Dragger {...props}>
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
    </div>
  )
}