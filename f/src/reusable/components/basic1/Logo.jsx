import { Link } from "react-router-dom";

import H1mdAndUp from "../basic0/H1mdAndUp";
import H1smOnly from "../basic0/H1smOnly";
import Image from "../basic0/Image";

export default function Logo() {
  return (
    <Link className="flex items-center justify-center font-semibold tracking-wide text-zinc-100">
      <Image></Image>
      <H1mdAndUp>Tiberio Eyecare Clinic</H1mdAndUp>
      <H1smOnly>TEC</H1smOnly>
    </Link>
  );
}
