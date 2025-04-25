import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import { config } from 'dotenv';
import { getRandomFileName } from '../utils/helpers';
import { MulterFile } from '../types/type';

config();

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private cloudFrontClient: CloudFrontClient;
  
  private readonly bucketName = process.env.BUCKET_NAME;
  private readonly bucketRegion = process.env.BUCKET_REGION;
  private readonly accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY_ID;
  private readonly secretAccessKey = process.env.AWS_BUCKET_SECRET_ACCESS_KEY;
  private readonly cloudFrontDistributionId =
    process.env.CLOUDFRONT_DISTRIBUTION_ID;
  private readonly cloudFrontUrl = process.env.CLOUDFRONT_URL;

  constructor() {
    if (
      !this.bucketName ||
      !this.bucketRegion ||
      !this.accessKeyId ||
      !this.secretAccessKey ||
      !this.cloudFrontDistributionId ||
      !this.cloudFrontUrl
    ) {
      throw new Error('Missing required environment variables');
    }

    this.s3Client = new S3Client({
      region: this.bucketRegion,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });

    this.cloudFrontClient = new CloudFrontClient({
      region: this.bucketRegion,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async uploadFile(file: MulterFile) {
    try {
      const filename = `uploads/hackops/${getRandomFileName()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      const response = await this.s3Client.send(command);
      return { response, filename };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('File upload failed');
    }
  }

  async removeFile(filename: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
      });

      await this.s3Client.send(command);
      await this.invalidateCloudFrontCache(filename);
    } catch (error) {
      console.error('Error removing file:', error);
      throw new Error('File removal failed');
    }
  }

  private async invalidateCloudFrontCache(filename: string) {
    try {
      const invalidationCommand = new CreateInvalidationCommand({
        DistributionId: this.cloudFrontDistributionId,
        InvalidationBatch: {
          CallerReference: Date.now().toString(),
          Paths: {
            Quantity: 1,
            Items: [`/${filename}`],
          },
        },
      });

      await this.cloudFrontClient.send(invalidationCommand);
    } catch (error) {
      console.error('Error invalidating CloudFront cache:', error);
      throw new Error('Cache invalidation failed');
    }
  }

  getImageUrl(filename: string) {
    return `${this.cloudFrontUrl}/${filename}`;
  }
}
