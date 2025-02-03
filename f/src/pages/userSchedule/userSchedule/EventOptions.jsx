import { useLocation, useParams } from "react-router-dom";
import ContentBox0 from "../../../reusable/components/basic0/ContentBox0";
import ContentBox1 from "../../../reusable/components/basic0/ContentBox1";
import H1MainTitle from "../../../reusable/components/basic0/H1MainTitle";
import BtnGoBack from "../../../reusable/components/basic2/BtnGoBack";
import { formatDateComplete } from "../../../lib/utils0";
import {
  confirmedUserGetOne,
  useFetch,
} from "../../../reusable/hooks/useHook1";
import Loading from "../../../reusable/components/basic1/Loading";
import BtnLink from "../../../reusable/components/basic0/BtnLink";
import Icon from "../../../reusable/components/basic0/Icon";
import {
  CalendarIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

export default function EventOptions() {
  const { id } = useParams();
  const { data } = useFetch(confirmedUserGetOne + id);

  const location = useLocation();
  const eData = location?.state;

  if (!data?.data) return <Loading></Loading>;

  if (data.data)
    return (
      <ContentBox0>
        <H1MainTitle>EventOptions</H1MainTitle>
        <ContentBox1>
          <div className="h-full w-full">
            <div className="flex w-full justify-end">
              <div>
                <BtnGoBack></BtnGoBack>
              </div>
            </div>
            <p>Event Date: {formatDateComplete(eData.start, true)}</p>
            <div className="mt-5 flex flex-col items-center justify-center gap-1">
              <div>
                <BtnLink to="userScheduleForm">
                  <Icon>
                    <CalendarIcon></CalendarIcon>
                  </Icon>
                  <p> Create schedule for {data.data.firstName} only.</p>
                </BtnLink>
              </div>
              <div>
                <BtnLink
                  to="eventForm"
                  state={{
                    eData,
                    data: data.data,
                  }}
                >
                  <Icon>
                    <UserIcon></UserIcon>
                  </Icon>
                  <p>Create event for {data.data.firstName} only.</p>
                </BtnLink>
              </div>
              <div>
                <BtnLink
                  to="eventForm/0"
                  state={{
                    eData,
                    data: data.data,
                  }}
                >
                  <Icon>
                    <UserGroupIcon></UserGroupIcon>
                  </Icon>
                  <p> Create event for All users.</p>
                </BtnLink>
              </div>
            </div>
          </div>
        </ContentBox1>
      </ContentBox0>
    );
}
