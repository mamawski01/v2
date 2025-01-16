import ContentBox0 from "../../reusable/components/basic0/ContentBox0";
import { urlEvents, usePreFetch } from "../../reusable/hooks/useHook1";

export default function Homepage() {
  const urlArr = urlEvents && urlEvents.filter((url) => url.includes("getAll"));

  const preFetchArr = [...(urlArr ?? [])];
  usePreFetch(preFetchArr);
  return <ContentBox0>Homepage</ContentBox0>;
}
