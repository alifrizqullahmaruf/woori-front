import { CSSProperties } from "react";
import BackSVG from "@/app/_common/assets/icons/Back.svg";
import CheckSVG from "@/app/_common/assets/icons/Check.svg";
import CloseSVG from "@/app/_common/assets/icons/Close.svg";
import DetailSVG from "@/app/_common/assets/icons/Detail.svg";
import EmptySVG from "@/app/_common/assets/icons/Empty.svg"
import InfoSVG from "@/app/_common/assets/icons/Info.svg";
import NotFoundSVG from "@/app/_common/assets/icons/NotFound.svg"
import TrendingUpSVG from "@/app/_common/assets/icons/Trendingup.svg";
import LaurenLogoSVG from "@/app/_common/assets/logo/lauren_logo.svg";
import LaurenLogoAltSVG from "@/app/_common/assets/logo/lauren_logo_alt.svg";

interface IconProps {
  className?: string;
  style?: CSSProperties;
}

export const LaurenLogo = (props: IconProps) => {
  return <LaurenLogoSVG {...props} />;
};

export const Back = (props: IconProps) => {
  return <BackSVG {...props} />;
};

export const Check = (props: IconProps) => {
  return <CheckSVG {...props} />;
};

export const Close = (props: IconProps) => {
  return <CloseSVG {...props} />;
};

export const Info = (props: IconProps) => {
  return <InfoSVG {...props} />;
};

export const Detail = (props: IconProps) => {
  return <DetailSVG {...props} />;
};

export const LaurenLogoAlt = (props: IconProps) => {
  return <LaurenLogoAltSVG {...props} />;
};

export const TrendingUp = (props: IconProps) => {
  return <TrendingUpSVG {...props} />;
};

export const Empty = (props: IconProps) => {
  return <EmptySVG {...props} />;
};

export const NotFound = (props: IconProps) => {
  return <NotFoundSVG {...props} />;
};