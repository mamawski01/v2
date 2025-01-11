import {
  AtSymbolIcon,
  BuildingLibraryIcon,
  ClipboardDocumentIcon,
  ExclamationTriangleIcon,
  HomeModernIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { remove } from "../../api/api";
import { calcAge, swalAlert } from "../../lib/utils1";
import Card from "../../reusable/components/basic0/Card";
import ContentBox0 from "../../reusable/components/basic0/ContentBox0";
import ContentBox1 from "../../reusable/components/basic0/ContentBox1";
import H1MainTitle from "../../reusable/components/basic0/H1MainTitle";
import Icon from "../../reusable/components/basic0/Icon";
import ImageProfile from "../../reusable/components/basic0/ImageProfile";
import Row from "../../reusable/components/basic0/Row";
import CreateSomething from "../../reusable/components/basic1/CreateSomething";
import Loading from "../../reusable/components/basic1/Loading";
import BtnAddInLink from "../../reusable/components/basic2/BtnAddInLink";
import { useFetch, useMutate } from "../../reusable/hooks/useHook1";
import BtnEditLink from "../../reusable/components/basic2/BtnEditLink";
import BtnDelete from "../../reusable/components/basic2/BtnDelete";

export default function ConfirmedUserList() {
  const { data } = useFetch("/confirmUserGetAll");
  const { mutate, isPending } = useMutate();

  async function onDelete(id, userId) {
    const confirmDelete = await swalAlert(
      "Yes, delete a confirmed user and all of its data.",
    );
    if (confirmDelete.isConfirmed) {
      mutate(remove(`/confirmedUserRemoveFile/${id}`));
      if (userId) {
        ("");
      }
    }
  }
  const confirmUsers = data?.data?.reverse();
  if (!confirmUsers) return <Loading></Loading>;
  if (confirmUsers)
    return (
      <ContentBox0>
        <H1MainTitle>ConfirmedUserList</H1MainTitle>
        {confirmUsers.length === 0 && (
          <CreateSomething>
            <p>List is empty, create something...</p>
            <BtnAddInLink to="/homepage/registryUserList/registryUserForm">
              Add User
            </BtnAddInLink>
          </CreateSomething>
        )}
        {confirmUsers.length > 0 && (
          <ContentBox1>
            <div className="flex w-full justify-end">
              <BtnAddInLink to="registryUserForm">Add User</BtnAddInLink>
            </div>
            <Row wider={true}>
              {confirmUsers.slice().map((data, i) => (
                <Card key={i} data={data}>
                  <div className="flex flex-col items-center justify-center">
                    <ImageProfile width="32" src={data.image}></ImageProfile>
                    <Icon>
                      <UserIcon></UserIcon>
                      <p>
                        {data.firstName} {data.middleName} {data.lastName}
                      </p>
                    </Icon>
                    <Icon>
                      <ClipboardDocumentIcon></ClipboardDocumentIcon>
                      <p>
                        {calcAge(data.birthdate)} years old. Birthday:{" "}
                        {data.birthdate}. Status: {data.status}. Gender:{" "}
                        {data.gender}.
                      </p>
                    </Icon>
                  </div>
                  <div className="flex w-full justify-evenly">
                    <BtnEditLink to={`confirmedUserForm/${data._id}`}>
                      Edit User
                    </BtnEditLink>
                    <BtnDelete
                      onClick={() => onDelete(data._id, data.userId)}
                      isPending={isPending}
                    >
                      Delete User
                    </BtnDelete>
                  </div>
                  <Icon>
                    <HomeModernIcon></HomeModernIcon>
                    <p>
                      {data.street} {data.purok} {data.brgy} {data.city}{" "}
                      {data.province} {data.country}
                    </p>
                  </Icon>
                  <Icon>
                    <PhoneIcon></PhoneIcon>
                    <p>
                      {data.contactNumber1} | {data.contactNumber2} |{" "}
                      {data.contactNumber3}
                    </p>
                  </Icon>
                  <Icon>
                    <AtSymbolIcon></AtSymbolIcon>
                    <p>{data.email}</p>
                  </Icon>
                  <Icon>
                    <BuildingLibraryIcon></BuildingLibraryIcon>
                    <p>
                      Pag-Ibig: {data.PagIbig} | PhilHealth: {data.PhilHealth} |
                      SSS: {data.SSS}
                    </p>
                  </Icon>
                  <Icon>
                    <ExclamationTriangleIcon></ExclamationTriangleIcon>
                    <p>
                      Person in case of Emergency:{" "}
                      {data.contactPersonNameInEmergency}. Contact number:{" "}
                      {data.contactPersonNumberInEmergency}
                    </p>
                  </Icon>
                </Card>
              ))}
            </Row>
          </ContentBox1>
        )}
      </ContentBox0>
    );
}
