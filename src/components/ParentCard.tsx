/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Countdown from "./Countdown";

export interface PARENTNFTType {
  maleTokenId: number;
  feMaleTokenId: number;
  maleImgUrl: string;
  feMaleImgUrl: string;
  startedTime: number;
}

export default function Card(props: {
  maleTokenId: number;
  feMaleTokenId: number;
  maleImgUrl: string;
  feMaleImgUrl: string;
  startedTime: number;
  owner: string;
  onWithdraw(): void;
}) {
  const [canBreedState, setCanBreedState] = useState<boolean>(false);
  const startedTime = new Date(Number(props.startedTime) * 1000 + 60000);

  return (
    <div className="relative w-full gap-5 p-5">
      {!canBreedState && (
        <div className="absolute top-0 bottom-0 left-0 right-0 w-full bg-gray-700 bg-opacity-90 z-[9999] items-center justify-center flex">
          <Countdown
            endDateTime={props.startedTime * 1000 + 100000} // 1209600000 is the timestamp of 2 weeks
            onCanBreed={() => setCanBreedState(true)}
          />
        </div>
      )}
      <div
        className={`w-full top-0 bottom-0 right-0 left-0 absolute bg-opacity-80 duration-300 transition-all ease-in-out cursor-pointer`}
      />
      <div className="absolute w-5 h-5 border-t-2 border-l-2 border-white -left-1 -top-1"></div>
      <div className="absolute w-5 h-5 border-t-2 border-r-2 border-white -right-1 -top-1"></div>
      <div className="absolute w-5 h-5 border-b-2 border-l-2 border-white -left-1 -bottom-1"></div>
      <div className="absolute w-5 h-5 border-b-2 border-r-2 border-white -right-1 -bottom-1"></div>
      <div className="flex items-center justify-center gap-5">
        <img src={`${props.maleImgUrl}`} alt="" width={100} height={100} />
        <div className="relative flex items-center justify-center p-1 text-white bg-gray-800">
          <p className="text-sm">{props.maleTokenId}</p>
          <span>:</span>
          <p className="text-sm">{props.feMaleTokenId}</p>
        </div>
        <img src={`${props.feMaleImgUrl}`} alt="" width={100} height={100} />
      </div>
      <div className="relative flex justify-center w-full mt-5">
        <button
          className="metaverse_fn_button white"
          onClick={() => props.onWithdraw()}
        >
          <span className="text">Withdraw</span>
        </button>
      </div>
    </div>
  );
}
