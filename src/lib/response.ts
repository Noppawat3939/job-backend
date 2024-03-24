import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { MESSAGE } from 'src/constants';
import { ERROR_STATUS_TYPE as STATUS_TYPE } from 'src/mapping';

export const exceptions = {
  unAuthorized: (message = 'Error unauthorized', error = STATUS_TYPE[401]) => {
    throw new UnauthorizedException(message, error);
  },
  fobbiden: (message = 'Error fobbiden', error = STATUS_TYPE[403]) => {
    throw new ForbiddenException(message, error);
  },
  badRequest: (message = 'Error bad request', error = STATUS_TYPE[400]) => {
    throw new BadRequestException(message, error);
  },
  notFound: (message = 'Error response not found', error = STATUS_TYPE[404]) => {
    throw new NotFoundException(message, error);
  },
  internalServerError: (message = 'Error internal server', error = STATUS_TYPE[500]) => {
    throw new InternalServerErrorException(message, error);
  },
};

export const accepts = <M extends string, D>(message: M, data?: D) => {
  return { success: true, message, ...(data && data) };
};

export const checkLastUpdated = (addTimeMinutes: number, updatedAt: Date | string) => {
  const addedTime = dayjs().add(addTimeMinutes, 'minutes');

  const canUpdate = addedTime.isAfter(updatedAt);

  if (canUpdate) return true;

  return exceptions.badRequest(MESSAGE.TIME_NOT_ARRIVE);
};
