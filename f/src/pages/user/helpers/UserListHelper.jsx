import PropTypes from "prop-types";
import Loading from "../../../reusable/components/basic1/Loading";
import ContentBox0 from "../../../reusable/components/basic0/ContentBox0";
import H1MainTitle from "../../../reusable/components/basic0/H1MainTitle";
import CreateSomething from "../../../reusable/components/basic1/CreateSomething";
import BtnAddInLink from "../../../reusable/components/basic2/BtnAddInLink";
import ContentBox1 from "../../../reusable/components/basic0/ContentBox1";
import Row from "../../../reusable/components/basic0/Row";
import Card from "../../../reusable/components/basic0/Card";
import ImageProfile from "../../../reusable/components/basic0/ImageProfile";
import Icon from "../../../reusable/components/basic0/Icon";
import {
  AtSymbolIcon,
  BuildingLibraryIcon,
  ClipboardDocumentIcon,
  ExclamationTriangleIcon,
  HomeModernIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { calcAge } from "../../../lib/utils1";
import BtnSave from "../../../reusable/components/basic2/BtnSave";
import BtnEditLink from "../../../reusable/components/basic2/BtnEditLink";
import BtnDelete from "../../../reusable/components/basic2/BtnDelete";
import { useMutate } from "../../../reusable/hooks/useHook1";
import BtnLink from "../../../reusable/components/basic0/BtnLink";

export default function UserListHelper({
  data,
  title = "",
  onTransfer,
  onDelete,
  to = "",
  toRegistryUserList = false,
}) {
  const { mutate, isPending } = useMutate();
  const users = data?.data?.reverse();
  if (!users) return <Loading></Loading>;
  if (users) {
    return (
      <ContentBox0>
        <H1MainTitle>{title}</H1MainTitle>
        {users.length === 0 && (
          <CreateSomething>
            <p>List is empty, create something...</p>
            {toRegistryUserList ? (
              <div>
                <BtnLink to="/homepage/registryUserList">
                  Go to Registry User
                </BtnLink>
              </div>
            ) : (
              <BtnAddInLink to="registryUserForm">Add User</BtnAddInLink>
            )}
          </CreateSomething>
        )}
        {users.length > 0 && (
          <ContentBox1>
            <div className="flex w-full justify-end">
              {toRegistryUserList ? (
                <div>
                  <BtnLink to="/homepage/registryUserList">
                    Go to Registry User
                  </BtnLink>
                </div>
              ) : (
                <BtnAddInLink to="registryUserForm">Add User</BtnAddInLink>
              )}
            </div>
            <Row wider={true}>
              {users.slice().map((data, i) => (
                <Card key={i} data={data}>
                  <div className="flex flex-col items-center justify-center">
                    <ImageProfile width="32" src={data.file}></ImageProfile>
                    <Icon>
                      <UserIcon></UserIcon>
                      <p>
                        {data.firstName} {data.middleName} {data.lastName}
                      </p>
                    </Icon>
                    <Icon>
                      <ClipboardDocumentIcon></ClipboardDocumentIcon>
                      <p>
                        {calcAge(data.birthDate, true)} years old. Birthday:{" "}
                        {data.birthDate}. Status: {data.statusSelect}. Gender:{" "}
                        {data.genderSelect}.
                      </p>
                    </Icon>
                  </div>
                  <div className="flex w-full justify-evenly">
                    {onTransfer && (
                      <BtnSave onClick={() => onTransfer(mutate, data._id)}>
                        Confirm User
                      </BtnSave>
                    )}
                    <BtnEditLink to={to + data._id}>Edit User</BtnEditLink>

                    <BtnDelete
                      onClick={() => onDelete(mutate, data._id)}
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
}

UserListHelper.propTypes = {
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onTransfer: PropTypes.func,
  title: PropTypes.string,
  to: PropTypes.string,
  toRegistryUserList: PropTypes.bool,
};
