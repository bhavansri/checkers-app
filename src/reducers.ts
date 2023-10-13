import { CpuMovePossibility, CpuType } from "./utils/constants";

type CpuAction = {
  type: "move" | "delete";
  movePossibility?: CpuMovePossibility;
  id: string;
};
