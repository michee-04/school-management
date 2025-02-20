import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthGuard } from './auth.guard';

class AuthService {}

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  const signedInUser = {} as any;
  const signedOutUser = {} as any;

  const signedInToken = 'signedInToken';
  const signOutToken = 'signOutToken';

  const signedInTokenPayload = {
    sub: new Types.ObjectId().toHexString(),
    prm: 'prm',
  } as any;

  const signOutTokenPayload = {
    sub: new Types.ObjectId().toHexString(),
    prm: 'prm',
  } as any;

  const getAllAndOverrideMock = jest.fn();
  const verifyTokenMock = jest.fn();
  const validatePayloadMock = jest.fn();
  const findKeystoreMock = jest.fn();
  const findUserByIdMock = jest.fn();

  const getRequestMock = jest.fn();

  const context = {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => getRequestMock(),
    }),
  } as ExecutionContext;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: getAllAndOverrideMock,
          },
        },
        {
          provide: AuthService,
          useValue: {
            verifyToken: verifyTokenMock,
            validatePayload: validatePayloadMock,
            findKeystore: findKeystoreMock,
          },
        },
      ],
    }).compile();

    authGuard = module.get(AuthGuard);
  });

  it('should pass for public api', async () => {
    const request = { headers: {} } as any; // ProtectedRequest;
    getRequestMock.mockReturnValue(request);
    getAllAndOverrideMock.mockReturnValue(true);

    const pass = authGuard.canActivate(context);
    expect(pass).resolves.toBe(true);
    expect(getAllAndOverrideMock).toHaveBeenCalled();
    expect(getRequestMock).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if auth token is not sent', async () => {
    const request = { headers: {} } as any; // ProtectedRequest;
    getAllAndOverrideMock.mockReturnValue(false);
    getRequestMock.mockReturnValue(request);

    const spyExtractTokenFromHeader = jest.spyOn(
      authGuard as any,
      'extractTokenFromHeader',
    );

    await expect(authGuard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(getAllAndOverrideMock).toHaveBeenCalled();
    expect(getRequestMock).toHaveBeenCalled();
    expect(spyExtractTokenFromHeader).toHaveBeenCalledWith(request);
    expect(verifyTokenMock).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if invalid token is sent', async () => {
    const request = {
      headers: { authorization: 'Bearer wrongToken' },
    } as any; //ProtectedRequest;

    getAllAndOverrideMock.mockReturnValue(false);
    getRequestMock.mockReturnValue(request);
    verifyTokenMock.mockRejectedValue(new UnauthorizedException());

    await expect(authGuard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(getAllAndOverrideMock).toHaveBeenCalled();
    expect(getRequestMock).toHaveBeenCalled();
    expect(verifyTokenMock).toHaveBeenCalledWith('wrongToken');
    expect(validatePayloadMock).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if signout user token is sent', async () => {
    const request = {
      headers: { authorization: 'Bearer ' + signOutToken },
    } as any; // ProtectedRequest;

    getAllAndOverrideMock.mockReturnValue(false);
    getRequestMock.mockReturnValue(request);
    verifyTokenMock.mockReturnValue(signOutTokenPayload);
    validatePayloadMock.mockReturnValue(true);
    findUserByIdMock.mockReturnValue(signedOutUser);
    findKeystoreMock.mockReturnValue(null);

    await expect(authGuard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(getAllAndOverrideMock).toHaveBeenCalled();
    expect(getRequestMock).toHaveBeenCalled();
    expect(verifyTokenMock).toHaveBeenCalledWith(signOutToken);
    expect(validatePayloadMock).toHaveBeenCalled();
    expect(findUserByIdMock).toHaveBeenCalled();
    expect(findKeystoreMock).toHaveBeenCalled();
  });

  it('should return true if correct token is sent for logged in user', async () => {
    const request = {
      headers: { authorization: 'Bearer ' + signedInToken },
    } as any; // ProtectedRequest;

    getAllAndOverrideMock.mockReturnValue(false);
    getRequestMock.mockReturnValue(request);
    verifyTokenMock.mockReturnValue(signedInTokenPayload);
    validatePayloadMock.mockReturnValue(true);
    findUserByIdMock.mockReturnValue(signedInUser);
    findKeystoreMock.mockReturnValue({} as any); // Keystore);

    const pass = await authGuard.canActivate(context);
    expect(pass).toBe(true);
    expect(getAllAndOverrideMock).toHaveBeenCalled();
    expect(getRequestMock).toHaveBeenCalled();
    expect(verifyTokenMock).toHaveBeenCalledWith(signedInToken);
    expect(validatePayloadMock).toHaveBeenCalled();
    expect(findUserByIdMock).toHaveBeenCalled();
    expect(findKeystoreMock).toHaveBeenCalled();
  });
});
