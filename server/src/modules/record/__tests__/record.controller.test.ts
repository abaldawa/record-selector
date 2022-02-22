/**
 * @author: abhijit.baldawa
 */

import { StatusCodes } from 'http-status-codes';
import { getRecordsByFilter } from '../record.controller';
import * as recordService from '../record.service';
import { DatabaseError } from '../../../errors';

const filteredRecords = [
  {
    key: 'hCXxyuAu',
    createdAt: new Date(),
    totalCount: 2085,
  },
];

jest.mock('../record.service', () => ({
  getRecordsByFilter: jest
    .fn()
    .mockImplementationOnce(async () => {
      throw new DatabaseError('DB error');
    })
    .mockResolvedValueOnce([])
    .mockImplementationOnce(async () => filteredRecords),
}));

describe('Record Controller', () => {
  describe('#getRecordsByFilter()', () => {
    const startDateStr = '2016-01-26';
    const startDate = new Date(startDateStr);
    const endDateStr = '2018-02-02';
    const endDate = new Date(endDateStr);
    const minCount = 50;
    const maxCount = 150;

    it(`Should return error if the 'startDate' is less than 'endDate'`, async () => {
      await expect(
        getRecordsByFilter({
          body: {
            startDate: endDateStr,
            endDate: startDateStr,
            minCount: maxCount,
            maxCount: minCount,
          },
        })
      ).resolves.toStrictEqual({
        statusCode: StatusCodes.BAD_REQUEST,
        response: {
          code: StatusCodes.BAD_REQUEST,
          msg: expect.any(String),
        },
      });

      expect(recordService.getRecordsByFilter).not.toHaveBeenCalled();
    });

    it(`Should return error if the 'minCount' is less than 'maxCount'`, async () => {
      await expect(
        getRecordsByFilter({
          body: {
            startDate: endDateStr,
            endDate: startDateStr,
            minCount: maxCount,
            maxCount: minCount,
          },
        })
      ).resolves.toStrictEqual({
        statusCode: StatusCodes.BAD_REQUEST,
        response: {
          code: StatusCodes.BAD_REQUEST,
          msg: expect.any(String),
        },
      });

      expect(recordService.getRecordsByFilter).not.toHaveBeenCalled();
    });

    it(`Should handle DB error and return proper 'code' and 'msg'`, async () => {
      await expect(
        getRecordsByFilter({
          body: {
            startDate: startDateStr,
            endDate: endDateStr,
            minCount,
            maxCount,
          },
        })
      ).resolves.toStrictEqual({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        response: {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          msg: 'DB error',
        },
      });

      expect(recordService.getRecordsByFilter).toHaveBeenLastCalledWith({
        startDate,
        endDate,
        minCount,
        maxCount,
      });
    });

    it(`Should return empty array if no records matched the filter`, async () => {
      await expect(
        getRecordsByFilter({
          body: {
            startDate: startDateStr,
            endDate: endDateStr,
            minCount,
            maxCount,
          },
        })
      ).resolves.toStrictEqual({
        statusCode: StatusCodes.OK,
        response: {
          code: 0,
          msg: 'Success',
          records: [],
        },
      });

      expect(recordService.getRecordsByFilter).toHaveBeenLastCalledWith({
        startDate,
        endDate,
        minCount,
        maxCount,
      });
    });

    it(`Should successfully return records based on input filter`, async () => {
      await expect(
        getRecordsByFilter({
          body: {
            startDate: startDateStr,
            endDate: endDateStr,
            minCount,
            maxCount,
          },
        })
      ).resolves.toStrictEqual({
        statusCode: StatusCodes.OK,
        response: {
          code: 0,
          msg: 'Success',
          records: filteredRecords,
        },
      });

      expect(recordService.getRecordsByFilter).toHaveBeenLastCalledWith({
        startDate,
        endDate,
        minCount,
        maxCount,
      });
    });
  });
});
