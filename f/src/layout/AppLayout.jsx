import { Outlet, ScrollRestoration } from "react-router-dom";
import {
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";

import Main from "./Main";
import MainHeader from "./MainHeader";
import MainSection from "./MainSection";
import MainSideBar from "./MainSideBar";
import H1mdAndUp from "../reusable/components/basic0/H1mdAndUp";
import H1smOnly from "../reusable/components/basic0/H1smOnly";
import Icon from "../reusable/components/basic0/Icon";
import Logo from "../reusable/components/basic1/Logo";
import H1SmallText from "../reusable/components/basic0/H1SmallText";
import Option from "../reusable/components/basic1/Option";
import BtnNavLink from "../reusable/components/basic0/BtnNavLink";

export default function AppLayout() {
  return (
    <div className="no-scrollbar relative mx-auto flex min-h-screen w-full flex-col overflow-y-scroll 2xl:w-5/6">
      <MainHeader>
        <Logo></Logo>
      </MainHeader>
      <MainSection>
        <MainSideBar>
          <H1SmallText>Staff</H1SmallText>
          <Option>
            <Icon>
              <UserGroupIcon></UserGroupIcon>
              <H1mdAndUp>Users</H1mdAndUp>
              <H1smOnly>Users</H1smOnly>
            </Icon>
            <BtnNavLink to="homepage/registryUserList">
              <H1mdAndUp>Registry User List</H1mdAndUp>
              <H1smOnly>Reg. User</H1smOnly>
            </BtnNavLink>
            <BtnNavLink to="homepage/confirmUserList">
              <H1mdAndUp>Confirmed User List</H1mdAndUp>
              <H1smOnly>Conf. User </H1smOnly>
            </BtnNavLink>
            <BtnNavLink to="homepage/manageUsers">
              <H1mdAndUp>Manage Users</H1mdAndUp>
              <H1smOnly>Man. Users</H1smOnly>
            </BtnNavLink>
          </Option>
          <H1SmallText>Utility</H1SmallText>
          <Option>
            <Icon>
              <WrenchScrewdriverIcon></WrenchScrewdriverIcon>
              <H1mdAndUp>Utilities</H1mdAndUp>
              <H1smOnly>Utils.</H1smOnly>
            </Icon>
            <BtnNavLink to="/">
              <H1mdAndUp>Spectacle Power Conversion</H1mdAndUp>
              <H1smOnly>Spec. Con.</H1smOnly>
            </BtnNavLink>
            <BtnNavLink to="/">
              <H1mdAndUp>Frame Pricing Guide</H1mdAndUp>
              <H1smOnly>Frame Pri.</H1smOnly>
            </BtnNavLink>
          </Option>
        </MainSideBar>
        <Main>
          <Outlet></Outlet>
        </Main>
      </MainSection>
      <ScrollRestoration
        getKey={(location) => {
          return location.key;
        }}
      />
    </div>
  );
}
