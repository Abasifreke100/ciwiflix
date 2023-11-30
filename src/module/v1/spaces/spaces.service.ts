import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { DoSpacesServiceLib } from './config';
import { generateIdentifier } from '../../../common/utils/uniqueId';
import { environment } from 'src/common/config/environment';
import { S3 } from 'aws-sdk';
import { Upload } from '@aws-sdk/lib-storage';

// Typical nestJs service
@Injectable()
export class SpacesService {
  constructor(@Inject(DoSpacesServiceLib) private readonly s3: AWS.S3) {}

  async uploadFile(file) {
    if (!file) return null;
    // Precaution to avoid having 2 files with the same name
    const fileName = `${generateIdentifier()}-${file.originalname}`;

    // Return a promise that resolves only when the file upload is complete
    return new Promise((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: environment.DOS.BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve(
              `https://${environment.DOS.BUCKET_NAME}.${environment.DOS.SPACE_LINK}/${fileName}`,
            );
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || 'Something went wrong'
                }`,
              ),
            );
          }
        },
      );
    });
  }

  async uploadBase64(data) {
    if (!data) return null;

    const buf = Buffer.from(
      data.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    const type = data.split(';')[0].split('/')[1];
    const filekey = generateIdentifier();

    const params = {
      Bucket: environment.DOS.BUCKET_NAME,
      Key: filekey,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`,
      ACL: 'public-read',
    };

    try {
      await this.s3.putObject(params).promise();
      return `https://${environment.DOS.BUCKET_NAME}.${environment.DOS.SPACE_LINK}/${filekey}`;
    } catch (err) {
      if (err) return null;
    }
  }

  async deleteFile(file) {
    const fileName = file.split(`${environment.DOS.SPACE_LINK}/`);

    return new Promise((resolve, reject) => {
      this.s3.deleteObject(
        {
          Bucket: environment.DOS.BUCKET_NAME,
          Key: fileName[1],
          // Key: fileName[1].split('.')[0],
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve('yes');
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || 'Something went wrong'
                }`,
              ),
            );
          }
        },
      );
    });
  }

  async uploadPathFile(file, filename) {
    return new Promise((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: environment.DOS.BUCKET_NAME,
          Key: filename,
          Body: file,
          ContentType: file.mimetype,
          ACL: 'public-read',
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve(
              `https://${environment.DOS.BUCKET_NAME}.${environment.DOS.SPACE_LINK}/${filename}`,
            );
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || 'Something went wrong'
                }`,
              ),
            );
          }
        },
      );
    });
  }

  /** NEW FILE UPLOAD METHODS*/

  async uploadFiles(file): Promise<any | null> {
    if (!file || !file.buffer) {
      return null;
    }

    const fileName = `${generateIdentifier()}-${file.originalname}`;

    try {
      // Directly upload if the file is small
      const partSize = 5 * 1024 * 1024;
      if (file.buffer.length <= partSize) {
        console.log(
          'File size is smaller than the minimum part size. Using regular upload.',
        );
        await this.uploadSmallFile(fileName, file.buffer, file.mimeType);
        return;
      } else {
        await this.uploadLargeFile(fileName, file.buffer, file.mimetype);
        console.log('big file');
      }

      return `https://${environment.DOS.BUCKET_NAME}.${environment.DOS.SPACE_LINK}/${fileName}`;
    } catch (error) {
      console.error('S3 Upload Failed:', error.message);
      throw new Error(`S3 Upload Failed: ${error.message}`);
    }
  }

  private async uploadSmallFile(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<void> {
    const s3Params: S3.Types.PutObjectRequest = {
      Bucket: environment.DOS.BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read',
    };

    await this.s3.upload(s3Params).promise();
  }

  private async uploadLargeFile(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<void> {
    try {
      // Step 1: Initiate multipart upload
      const uploadParams = {
        name: fileName,
      };
      const multipartUpload = await this.createMultipartUpload(uploadParams);

      // Step 2: Determine part size and calculate number of parts
      // const partSize = 3 * 1024 * 1024; // 3 MB part size (adjust as needed)
      const partSize = fileBuffer.length; // 3 MB part size (adjust as needed)
      const totalParts = Math.ceil(fileBuffer.length / partSize);

      // // Step 3: Upload parts in parallel
      const uploadPromises = [];
      for (let i = 0; i < totalParts; i++) {
        const start = i * partSize;
        const end = Math.min((i + 1) * partSize, fileBuffer.length);

        const partBuffer = fileBuffer.slice(start, end);

        const partParams = {
          name: fileName,
          uploadId: multipartUpload.UploadId,
          partNumber: i + 1,
          file: partBuffer,
        };

        uploadPromises.push(this.uploadPart(partParams));
      }

      // Step 4: Wait for all parts to be uploaded
      const uploadedParts = await Promise.all(uploadPromises);

      // Step 5: Complete multipart upload
      const completeParams = {
        name: fileName,
        uploadId: multipartUpload.UploadId,
        parts: uploadedParts.map((part, index) => ({
          PartNumber: index + 1,
          ETag: part.ETag,
        })),
      };

      await this.completeMultiPart(completeParams);
    } catch (error) {
      console.log(error);
      throw new Error(`${error.message}`);
      throw new Error(`Large File Upload Failed: ${error.message}`);
    }
  }

  async createMultipartUpload(body) {
    const params = {
      Bucket: environment.DOS.BUCKET_NAME,
      Key: String(body.name),
    };

    return await this.s3.createMultipartUpload(params).promise();
  }

  async uploadPart(body) {
    const params = {
      Bucket: environment.DOS.BUCKET_NAME,
      Key: String(body.name),
      UploadId: body.uploadId,
      PartNumber: body.partNumber,
      // Body: body.file,
    };

    return await this.s3.uploadPart(params).promise();
  }

  async completeMultiPart(body) {
    const params = {
      Bucket: environment.DOS.BUCKET_NAME,
      Key: String(body.name),
      UploadId: body.uploadId,
      MultipartUpload: {
        Parts: body.parts,
      },
    };

    return await this.s3.completeMultipartUpload(params).promise();
  }

  // async getPreSignedUrl(body) {
  //   const params = {
  //     Bucket: environment.DOS.BUCKET_NAME,
  //     Key: String(body.name),
  //     Expires: 60,
  //     ContentType: body.contentType,
  //   };
  //
  //   return await this.s3.getSignedUrlPromise('putObject', params);
  // }
  //
  // async abortMultiPart(body) {
  //   const params = {
  //     Bucket: environment.DOS.BUCKET_NAME,
  //     Key: String(body.name),
  //     UploadId: body.uploadId,
  //   };
  //
  //   return await this.s3.abortMultipartUpload(params).promise();
  // }
}
