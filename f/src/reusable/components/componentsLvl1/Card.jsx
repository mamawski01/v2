import PropTypes from "prop-types";
import { useState } from "react";

import ContentBox2 from "../componentsLvl2/ContentBox2";

export default function Card({ children }) {
  const [expand, expandSet] = useState();
  return (
    <ContentBox2>
      <div
        className={`flex w-full flex-col items-center justify-center rounded border border-gray-300/20 bg-black bg-black/60 p-2 text-center backdrop-blur-sm transition-all duration-300 hover:bg-zinc-950/30`}
      >
        <div className="cursor-pointer" onClick={() => expandSet(!expand)}>
          {Array.isArray(children) ? children[0] : children}

          <div
            className={`${expand ? "max-h-screen" : "max-h-0"} overflow-hidden transition-all duration-300`}
          >
            <div>
              {children.length > 1 &&
                children.slice(2).map((node, i) => (
                  <div key={i} title={node.props.children}>
                    {node}
                  </div>
                ))}
            </div>
          </div>
        </div>
        {Array.isArray(children) ? children[1] : children}
      </div>
    </ContentBox2>
  );
}

Card.propTypes = {
  children: PropTypes.node,
};
