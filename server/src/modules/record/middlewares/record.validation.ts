/**
 * @author: abhijit.baldawa
 */

import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import { ControllerFun } from '../../../rest-api/types';
import { GetRecordsByFilterBody } from '../record.controller';
import { ValidationError } from '../../../rest-api/errors';

const getRecordsByFilterBodySchema = Joi.object().keys({
  endDate: Joi.date().required(),
  startDate: Joi.date().required(),
  minCount: Joi.number().integer().strict().required(),
  maxCount: Joi.number().integer().strict().required(),
});

/**
 * @public
 *
 * Input validator for POST /records/filter
 *
 * @param body
 */
const getRecordsByFilterInputValidator: ControllerFun<
  GetRecordsByFilterBody,
  never,
  never,
  never
> = ({ body }) => {
  const { error } = Joi.compile(getRecordsByFilterBodySchema)
    .prefs({ errors: { label: 'key' } })
    .validate(body);

  if (error) {
    const errorMessage = error.details.map(({ message }) => message).join(', ');
    throw new ValidationError(StatusCodes.BAD_REQUEST, errorMessage);
  }
};

export { getRecordsByFilterInputValidator };
