import { ConfigProvider } from "antd";
import { OrdersPage } from "./pages/OrdersPage";
import "./index.css";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "rgb(233, 41, 76)",
          colorPrimaryHover: "var(--color-primary-hover)",
          colorPrimaryActive: "var(--color-primary-hover)",
          colorTextLightSolid: "var(--color-text-primary)",
        },
      }}
    >
      <OrdersPage />
    </ConfigProvider>
  );
}

export default App;