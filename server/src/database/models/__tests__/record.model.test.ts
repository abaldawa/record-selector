/**
 * @author: abhijit.baldawa
 */

import { getRecordsByFilter } from '../record.model';
import { DatabaseError } from '../../../errors';

const aggregateFun = jest.fn();

jest.mock('mongoose', () => ({
  Schema: jest.fn(),
  model: () => ({
    aggregate: (...args: any[]) => aggregateFun(...args),
  }),
}));

describe('Record model', () => {
  describe('#getRecordsByFilter() ', () => {
    const getRecordsByFilterArgs = {
      startDate: new Date(),
      endDate: new Date(),
      minCount: 10,
      maxCount: 20,
    };
    const filteredRecords = [
      {
        key: 'hCXxyuAu',
        createdAt: new Date(),
        totalCount: 2085,
      },
    ];

    beforeAll(() => {
      aggregateFun
        .mockRejectedValueOnce(new Error('DB error'))
        .mockResolvedValueOnce(filteredRecords);
    });

    it(`Should handle database error and throw and instance of 'DatabaseError'`, async () => {
      await expect(
        getRecordsByFilter(getRecordsByFilterArgs)
      ).rejects.toBeInstanceOf(DatabaseError);
    });

    it(`Should successfully return records based on input filter`, async () => {
      await expect(
        getRecordsByFilter(getRecordsByFilterArgs)
      ).resolves.toStrictEqual(filteredRecords);

      expect(aggregateFun).lastCalledWith([
        { $project: { key: 1, createdAt: 1, totalCount: { $sum: '$counts' } } },
        {
          $match: {
            createdAt: {
              $gte: getRecordsByFilterArgs.startDate,
              $lte: getRecordsByFilterArgs.endDate,
            },
            totalCount: {
              $gte: getRecordsByFilterArgs.minCount,
              $lte: getRecordsByFilterArgs.maxCount,
            },
          },
        },
      ]);
    });
  });
});
