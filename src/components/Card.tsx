/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { GrCheckboxSelected, GrRadialSelected, GrSelect } from "react-icons/gr";
import { SelectedSVG } from "./svgIcons";

export interface NFTType {
  tokenId: number;
  imgUrl: string;
}

export default function Card(props: {
  tokenId: number;
  name: string;
  imgUrl: string;
  isUsed: boolean;
  selectedToken: NFTType[] | undefined;
  onCardClick(): void;
}) {
  const [hoverState, setHoverState] = useState<boolean>(false);

  return (
    <>
      <div className="relative w-full rounded-lg">
        <div
          className={`w-full top-0 bottom-0 right-0 left-0 absolute ${
            (hoverState || props.imgUrl === props.selectedToken?.[0]?.imgUrl) &&
            "backdrop-blur-sm"
          } bg-opacity-80 duration-300 transition-all ease-in-out cursor-pointer rounded-lg`}
          onMouseOver={() => setHoverState(true)}
          onMouseLeave={() => setHoverState(false)}
          onClick={() => props.onCardClick()}
        />
        {(hoverState || props.imgUrl === props.selectedToken?.[0]?.imgUrl) && (
          <div className="absolute top-0 right-0 p-1 text-white rounded-tl-md">
            <SelectedSVG width={"20px"} height={"20px"} color={"white"} />
          </div>
        )}
        <img
          src={`${props.imgUrl}`}
          alt=""
          width={280}
          className="h-full rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 p-1 text-center text-white bg-gray-800 bg-opacity-40 rounded-b-md">
          <p className="py-2 text-sm">{props.name}</p>
        </div>
        {props.isUsed && (
          <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center p-1 text-white bg-gray-800 rounded-md rounded-tr-md bg-opacity-95 z-[9999]">
            <p className="text-sm">Already Used !</p>
          </div>
        )}
      </div>
    </>
  );
}
