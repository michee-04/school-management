import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';

export class EddsaKeypairService {
  static async generatePublicKeyDidDocument(keyPair: Record<string, any>) {
    return {
      '@context': keyPair['@context'],
      id: keyPair.controller,
      type: keyPair.type,
      verificationMethod: [
        {
          '@context': keyPair['@context'],
          id: keyPair.id,
          type: keyPair.type,
          controller: keyPair.controller,
          publicKeyMultibase: keyPair.publicKeyMultibase,
        },
      ],
      authentication: [keyPair.id],
      assertionMethod: [keyPair.id],
      capabilityDelegation: [keyPair.id],
      capabilityInvocation: [keyPair.id],
    };
  }

  static async generateKeyPair(
    domainName: string,
    controllerName: string,
    keyName: string,
  ) {
    const controllerId = `did:web:${domainName}:${controllerName}`;
    const keyId = `${controllerId}#${keyName}`;

    const privateKey = await Ed25519VerificationKey2020.generate({
      id: keyId,
      controller: controllerId,
    });
    const keyPair = {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1',
      ],
      id: privateKey.id,
      controller: privateKey.controller,
      type: privateKey.type,
      privateKeyMultibase: privateKey.privateKeyMultibase,
      publicKeyMultibase: privateKey.publicKeyMultibase,
    };

    return keyPair;
  }

  static async generateSigningKeys(
    domainName: string,
    controllerName: string,
    keyName: string,
  ): Promise<{ privateKey: any; publicKey: any }> {
    return new Promise((resolve) => {
      EddsaKeypairService.generateKeyPair(
        domainName,
        controllerName,
        keyName,
      ).then((keyPair) => {
        EddsaKeypairService.generatePublicKeyDidDocument(keyPair).then(
          (didDocument) => {
            resolve({
              privateKey: keyPair,
              publicKey: didDocument,
            });
          },
        );
      });
    });
  }
}
