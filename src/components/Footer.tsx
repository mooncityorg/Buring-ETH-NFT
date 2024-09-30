import { useEffect, useState } from "react";

import * as Gricon from "react-icons/gr";

export default function Footer() {

  return (
    <footer className="bg-black h-[70px] flex items-center justify-center w-full">
      <p
        className="items-center h-[70px] px-4 py-5 text-white md:flex gap-2 text-[22px] justify-center"
      >
        2023 ©
        <a href="https://twitter.com/hellainsnft" target="_blank" rel="noreferrer">Hellains NFT</a>

      </p>
    </footer>
  );
}
