/**
 * @author: abhijit.baldawa
 */

import { model, Schema, Types } from 'mongoose';
import { DatabaseError } from '../../errors';

const COLLECTION_NAME = 'record';

// interface representing a document in MongoDB
interface IRecord {
  key: string;
  value: string;
  createdAt: Date;
  counts: Types.Array<number>;
}

// Schema corresponding to the document interface
const recordSchema = new Schema<IRecord>({
  key: { type: String, required: true },
  value: { type: String, required: true },
  createdAt: { type: Date, required: true },
  counts: [{ type: Number }],
});

// Mongoose model to interact with mongoDB
const RecordModel = model<IRecord>(COLLECTION_NAME, recordSchema);

// --------- Model methods -----
type FilteredRecord = {
  key: string;
  createdAt: Date;
  totalCount: number;
};

type GetRecordsByFilterArgs = {
  startDate: Date;
  endDate: Date;
  minCount: number;
  maxCount: number;
};

/**
 * @public
 *
 * Filters record based in input filters and responds
 *
 * @param startDate
 * @param endDate
 * @param minCount
 * @param maxCount
 */
const getRecordsByFilter = async ({
  startDate,
  endDate,
  minCount,
  maxCount,
}: GetRecordsByFilterArgs): Promise<FilteredRecord[]> => {
  try {
    return await RecordModel.aggregate<FilteredRecord>([
      { $project: { key: 1, createdAt: 1, totalCount: { $sum: '$counts' } } },
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          totalCount: {
            $gte: minCount,
            $lte: maxCount,
          },
        },
      },
    ]);
  } catch (error) {
    throw new DatabaseError(
      `Error querying record from DB. Reason -> ${error}`
    );
  }
};

export { GetRecordsByFilterArgs, FilteredRecord, getRecordsByFilter };
