/**
 * @author: abhijit.baldawa
 */

import { getRecordsByFilter } from '../record.controller';
import * as recordService from '../record.service';
import { DatabaseError } from '../../../errors';
import { ValidationError } from '../../../rest-api/errors';

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
      ).rejects.toBeInstanceOf(ValidationError);

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
      ).rejects.toBeInstanceOf(ValidationError);

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
      ).rejects.toBeInstanceOf(DatabaseError);

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
      ).resolves.toStrictEqual({ records: [] });

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
      ).resolves.toStrictEqual({ records: filteredRecords });

      expect(recordService.getRecordsByFilter).toHaveBeenLastCalledWith({
        startDate,
        endDate,
        minCount,
        maxCount,
      });
    });
  });
});
