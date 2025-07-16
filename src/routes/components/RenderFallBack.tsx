// import { Spin } from 'antd';
import { Spinner } from "@heroui/spinner";

export default function RenderFallback() {
  return (
    <div className="grid h-full grow place-items-center">
      <Spinner size="lg" />
    </div>
  );
}
