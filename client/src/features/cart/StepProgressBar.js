import React from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

function StepProgressBar({ percent }) {
  if (percent > 100) {
    percent = 100;
  } else if (percent < 0) {
    percent = 0;
  }

  return (
    <ProgressBar
      percent={percent}
      filledBackground="linear-gradient(to right, #00ad57, #77da90)"
    >
      <Step transition="scale">
        {({ accomplished }) => (
          <span className="absolute top-3 text-secondary text-xs left-0">
            Mua
          </span>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <>
            {accomplished && (
              <div className="absolute w-[20px] h-[20px] flex items-center justify-center rounded-full bg-white border-2 border-[#00ad57]">
                <CheckRoundedIcon className="!w-[12px] !h-[12px] text-[#00ad57]" />
              </div>
            )}

            <span className="absolute bottom-3 text-secondary text-xs">
              -10k
            </span>
            <span className="absolute top-3 text-secondary text-xs">149k</span>
          </>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <>
            {accomplished && (
              <div className="right-0 absolute w-[20px] h-[20px] flex items-center justify-center rounded-full bg-white border-2 border-[#00ad57]">
                <CheckRoundedIcon className="!w-[12px] !h-[12px] text-[#00ad57]" />
              </div>
            )}

            <span className="absolute bottom-3 text-secondary text-xs right-0">
              -30k
            </span>
            <span className="absolute top-3 text-secondary text-xs right-0">
              299k
            </span>
          </>
        )}
      </Step>
    </ProgressBar>
  );
}

export default StepProgressBar;
