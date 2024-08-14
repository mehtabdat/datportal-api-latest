type PrismaErrorCode = string;
declare const prismaHttpMap: (prismaErrorCode: PrismaErrorCode) => 400 | 500;
