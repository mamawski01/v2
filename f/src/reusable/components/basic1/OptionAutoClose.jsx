import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";

import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Btn from "../basic0/Btn";
import Icon from "../basic0/Icon";

export default function OptionAutoClose({
  children = <p>Option</p>,
  topRight = false,
}) {
  const [collapse, collapseSet] = useState(false);

  const optionRef = useRef();
  useEffect(() => {
    function callBack(e) {
      if (!optionRef.current?.contains(e.target)) {
        collapseSet(false);
      }
    }

    document.addEventListener("mouseleave", callBack, true);
    //cleaning
    return () => {
      document.removeEventListener("mouseleave", callBack, true);
    };
  }, [collapseSet]);

  return (
    <div
      className={`${topRight ? "right-1" : "left-1"} absolute top-1 z-10 w-fit`}
      ref={optionRef}
    >
      <Btn onClick={() => collapseSet(!collapse)} ghost={true}>
        {topRight ? (
          <>
            <div
              className={`${collapse && "rotate-90"} transition-all duration-500`}
            >
              <Icon iconWith="w-0">
                <ChevronRightIcon width={"1rem"}></ChevronRightIcon>
              </Icon>
            </div>
            <div>{Array.isArray(children) ? children[0] : children}</div>
          </>
        ) : (
          <>
            <div>{Array.isArray(children) ? children[0] : children}</div>
            <div
              className={`${collapse && "rotate-90"} transition-all duration-500`}
            >
              <Icon iconWith="w-0">
                <ChevronRightIcon width={"1rem"}></ChevronRightIcon>
              </Icon>
            </div>
          </>
        )}
      </Btn>
      <div
        className={`px-3 transition-all duration-500 ${collapse ? "max-h-screen" : "max-h-0"} relative overflow-hidden text-sm`}
      >
        <ul className="flex flex-col gap-2 rounded-b border-l border-gray-300/20 bg-black/80 p-1 px-2 backdrop-blur-sm">
          {children.length > 1 &&
            children.slice(1).map((node, i) => (
              <li key={i} title={node.props.children}>
                {node}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

OptionAutoClose.propTypes = {
  children: PropTypes.node,
  topRight: PropTypes.bool,
};
