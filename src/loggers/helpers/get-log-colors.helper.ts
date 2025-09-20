import winston from "winston";
import { logColors } from "../consts/log-colors";

export const getLogColors = () => winston.addColors(logColors);
