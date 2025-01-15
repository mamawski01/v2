import {
  CalendarDaysIcon,
  CalendarIcon,
  IdentificationIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import BtnLink from "../../reusable/components/basic0/BtnLink";
import Card from "../../reusable/components/basic0/Card";
import ContentBox0 from "../../reusable/components/basic0/ContentBox0";
import ContentBox1 from "../../reusable/components/basic0/ContentBox1";
import H1MainTitle from "../../reusable/components/basic0/H1MainTitle";
import Icon from "../../reusable/components/basic0/Icon";
import ImageProfile from "../../reusable/components/basic0/ImageProfile";
import Row from "../../reusable/components/basic0/Row";
import CreateSomething from "../../reusable/components/basic1/CreateSomething";
import Loading from "../../reusable/components/basic1/Loading";
import { confirmedUserGetAll, useFetch } from "../../reusable/hooks/useHook1";
import BtnEditLink from "../../reusable/components/basic2/BtnEditLink";

export default function ManageUsers() {
  const { data } = useFetch(confirmedUserGetAll);
  const confirmUsers = data?.data?.reverse();
  if (!confirmUsers) return <Loading></Loading>;
  if (confirmUsers) {
    return (
      <ContentBox0>
        <H1MainTitle>ManageUsers</H1MainTitle>
        {confirmUsers.length === 0 && (
          <CreateSomething>
            <p>List is empty, create something...</p>
            <div>
              <BtnLink to="/homepage/registryUserList">
                Go to Registry User
              </BtnLink>
            </div>
          </CreateSomething>
        )}

        {confirmUsers.length > 0 && (
          <ContentBox1>
            <div className="flex w-full justify-end">
              <div>
                <BtnLink to="/homepage/registryUserList">
                  Go to Registry User
                </BtnLink>
              </div>
            </div>
            <Row wider={true}>
              {confirmUsers.slice().map((data, i) => (
                <Card key={i}>
                  <div className="flex flex-col items-center justify-center">
                    <ImageProfile width="32" src={data.file}></ImageProfile>
                    <Icon>
                      <IdentificationIcon></IdentificationIcon>
                      <p>Data Id: {data.dataId}</p>
                    </Icon>
                    <Icon>
                      <UserIcon></UserIcon>
                      <p>
                        {data.firstName} {data.middleName} {data.lastName}
                      </p>
                    </Icon>
                  </div>
                  <div className="mb-1 flex w-full flex-col justify-evenly">
                    <div className="flex justify-center">
                      <div>
                        <BtnEditLink to={`manageUserForm/${data._id}`}>
                          Authenticate User
                        </BtnEditLink>
                      </div>
                    </div>
                    <div className="flex w-full justify-evenly">
                      <div>
                        <BtnLink
                          to={`userDefaultSchedule/${data._id}/${data.userId}`}
                        >
                          <Icon>
                            <CalendarIcon></CalendarIcon>
                          </Icon>
                          User Weekly Schedule
                        </BtnLink>
                      </div>
                      <div>
                        <BtnLink to={`userSchedule/${data._id}/${data.userId}`}>
                          <Icon>
                            <CalendarDaysIcon></CalendarDaysIcon>
                          </Icon>
                          User Schedule
                        </BtnLink>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </Row>
          </ContentBox1>
        )}
      </ContentBox0>
    );
  }
}
