/**
 * @author: abhijit.baldawa
 */

import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { ControllerFun } from '../../rest-api/types';
import { FilteredRecord } from '../../database/models/record.model';
import * as recordService from './record.service';
import {
  ControllerError,
  isKnownError,
  KnownAndUnknownErrors,
  ValidationError,
} from '../../rest-api/errors';

interface GetRecordsByFilterBody {
  startDate: string;
  endDate: string;
  minCount: number;
  maxCount: number;
}

interface GetRecordsByFilterResponse {
  records: FilteredRecord[];
}

/**
 * @public
 *
 * Handler for POST /records/filter
 *
 * @param body
 */
const getRecordsByFilter: ControllerFun<
  GetRecordsByFilterBody,
  never,
  never,
  GetRecordsByFilterResponse
> = async ({ body }) => {
  try {
    const {
      startDate: startDateStr,
      endDate: endDateStr,
      minCount,
      maxCount,
    } = body!;
    const [startDate, endDate] = [new Date(startDateStr), new Date(endDateStr)];

    if (endDate.getTime() - startDate.getTime() <= 0) {
      throw new ValidationError(
        StatusCodes.BAD_REQUEST,
        `'startDate' must be earlier than 'endDate'`
      );
    }

    if (maxCount - minCount <= 0) {
      throw new ValidationError(
        StatusCodes.BAD_REQUEST,
        `'minCount' must be smaller than 'maxCount'`
      );
    }

    const filteredRecords = await recordService.getRecordsByFilter({
      startDate,
      endDate,
      minCount,
      maxCount,
    });

    return { records: filteredRecords };
  } catch (error: unknown) {
    if (isKnownError(error as KnownAndUnknownErrors)) {
      throw error;
    }

    throw new ControllerError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Error handling request. Reason -> ${(error as Error).message}`
    );
  }
};

/**
 * Handle response manually
 * @param args
 */
const echoHandler: ControllerFun<
  never,
  never,
  never,
  never,
  Request,
  Response
> = async (args) => {
  const { req, res } = args;

  if (req && res) {
    req.pipe(res);
  }
};

export {
  GetRecordsByFilterBody,
  GetRecordsByFilterResponse,
  echoHandler,
  getRecordsByFilter,
};
