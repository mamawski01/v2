import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useRouteError } from "react-router-dom";

import ContentBox0 from "../basic0/ContentBox0";
import BtnLink from "../basic0/BtnLink";

export default function Error() {
  const error = useRouteError();

  return (
    <ContentBox0>
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex w-fit flex-col items-center justify-center">
          <BtnLink to="/">
            <div className="mx-auto flex w-96 animate-pulse items-center justify-center">
              <ExclamationTriangleIcon></ExclamationTriangleIcon>
            </div>
          </BtnLink>
          <p>Click Here to go to Homepage.</p>
          <div>{error.data || error.message}</div>
        </div>
      </div>
    </ContentBox0>
  );
}
