/**
 * @author: abhijit.baldawa
 */

import * as recordModel from '../../database/models/record.model';

/**
 * @public
 * @param filterObj
 */
const getRecordsByFilter = (filterObj: recordModel.GetRecordsByFilterArgs) =>
  recordModel.getRecordsByFilter(filterObj);

export { getRecordsByFilter };
