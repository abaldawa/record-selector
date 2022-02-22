/**
 * @author: abhijit.baldawa
 */

import { StatusCodes } from 'http-status-codes';
import { ControllerFun } from '../../rest-api/types';
import { FilteredRecord } from '../../database/models/record.model';
import * as recordService from './record.service';
import { DatabaseError } from '../../errors';
import { ValidationError, getErrorDetails } from '../../rest-api/errors';

interface GetRecordsByFilterBody {
  startDate: string;
  endDate: string;
  minCount: number;
  maxCount: number;
}

interface GetRecordsByFilterResponse {
  code: 0 | StatusCodes;
  msg: string;
  records?: FilteredRecord[];
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
> = async ({
  body,
}): Promise<{
  statusCode: StatusCodes;
  response: GetRecordsByFilterResponse;
}> => {
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

    return {
      statusCode: StatusCodes.OK,
      response: {
        code: 0,
        msg: 'Success',
        records: filteredRecords,
      },
    };
  } catch (error: unknown) {
    const { statusCode, errorMessage } = getErrorDetails(
      error as ValidationError | DatabaseError | Error,
      'Error handling request'
    );

    return {
      statusCode,
      response: {
        code: statusCode,
        msg: errorMessage,
      },
    };
  }
};

export {
  GetRecordsByFilterBody,
  GetRecordsByFilterResponse,
  getRecordsByFilter,
};
