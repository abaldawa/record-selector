/**
 * @author: abhijit.baldawa
 */

import { getRecordsByFilter } from '../record.service';
import * as recordModel from '../../../database/models/record.model';

const filteredRecords = [
  {
    key: 'hCXxyuAu',
    createdAt: new Date(),
    totalCount: 2085,
  },
];

jest.mock('../../../database/models/record.model', () => ({
  getRecordsByFilter: jest
    .fn()
    .mockResolvedValueOnce([])
    .mockImplementationOnce(async () => filteredRecords),
}));

describe('Record service', () => {
  describe('#getRecordsByFilter() ', () => {
    const getRecordsByFilterArgs = {
      startDate: new Date(),
      endDate: new Date(),
      minCount: 10,
      maxCount: 20,
    };

    it(`Should return empty array if no records matched the filter`, async () => {
      await expect(
        getRecordsByFilter(getRecordsByFilterArgs)
      ).resolves.toStrictEqual([]);

      expect(recordModel.getRecordsByFilter).lastCalledWith(
        getRecordsByFilterArgs
      );
    });

    it(`Should successfully return records based on input filter`, async () => {
      await expect(
        getRecordsByFilter(getRecordsByFilterArgs)
      ).resolves.toStrictEqual(filteredRecords);

      expect(recordModel.getRecordsByFilter).lastCalledWith(
        getRecordsByFilterArgs
      );
    });
  });
});
