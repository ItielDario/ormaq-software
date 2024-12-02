import { ConfigFileAuthenticationDetailsProvider } from 'oci-common';
import { ObjectStorageClient } from 'oci-objectstorage';

const provider = new ConfigFileAuthenticationDetailsProvider(".oci/config", "DEFAULT");
const client = new ObjectStorageClient({ authenticationDetailsProvider: provider });

const namespaceName = "axfyzw7gyrvi";
const bucketName = "bucket-ormaq";

async function enviarObjeto(nome, objeto) {
  const putObjectRequest = {
      namespaceName,
      bucketName,
      putObjectBody: objeto,
      objectName: nome
  };

  try {
      const putObjectResponse = await client.putObject(putObjectRequest);
      console.log("Put Object executed successfully");
      return putObjectResponse;
  } catch (error) {
      console.error("Erro ao enviar objeto:", error);
      throw error;
  }
}

export default enviarObjeto;