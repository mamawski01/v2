import { useRefresh } from "../../hooks/useHook0";
import ContentBox0 from "../basic0/ContentBox0";

export default function Loading() {
  useRefresh();
  return (
    <ContentBox0>
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="flex h-96 w-96 animate-spin justify-center rounded-full border-8 border-solid border-current border-e-transparent motion-reduce:animate-[spin_3s_linear_infinite]"></div>
        <p className="animate-pulse"> Loading. . .</p>
      </div>
    </ContentBox0>
  );
}
