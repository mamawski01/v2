import { ChevronRightIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

import Icon from "../basic0/Icon";
import Btn from "../componentsLvl1/Btn";
import { useState } from "react";

export default function SideBarOption({ children = <p>Option</p> }) {
  const [collapse, collapseSet] = useState(false);
  return (
    <div className="mb-2 w-full">
      <Btn onClick={() => collapseSet(!collapse)} ghost={true}>
        <div>{Array.isArray(children) ? children[0] : children}</div>
        <div
          className={`${collapse && "rotate-90"} transition-all duration-500`}
        >
          <Icon iconWith="w-0">
            <ChevronRightIcon width={"1rem"}></ChevronRightIcon>
          </Icon>
        </div>
      </Btn>
      <div
        className={`px-3 transition-all duration-500 ${collapse ? "max-h-screen" : "max-h-0"} overflow-hidden text-sm`}
      >
        <ul className="flex flex-col gap-2 border-l border-gray-300/20 p-1 px-2">
          {children.length > 1 &&
            children.slice(1).map((node, i) => (
              <ul key={i} title={node.props.children}>
                {node}
              </ul>
            ))}
        </ul>
      </div>
    </div>
  );
}

SideBarOption.propTypes = {
  children: PropTypes.node,
};
