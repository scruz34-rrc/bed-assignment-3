import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface RequestSchemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}