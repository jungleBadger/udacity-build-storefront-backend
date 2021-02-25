"use strict";

import * as dotenv from "dotenv";
let dotEnvProps: Object = {"silent": true};
dotenv.config(dotEnvProps);

import {run} from "./server";

run();