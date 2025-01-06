import request from "supertest";
import { Express } from "express";
import { IUser } from "../models/users_model";

export type User = IUser & { token?: string };
