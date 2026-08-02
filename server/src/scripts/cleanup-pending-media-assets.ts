import mongoose from 'mongoose';

import { MONGO_URI } from '../constants/env';
import {
  cleanupPendingMediaAssets,
  type CleanupPendingMediaAssetsResult,
} from '../services/media.service';

const DEFAULT_OLDER_THAN_HOURS = 24;
const DEFAULT_LIMIT = 100;
const MS_IN_HOUR = 60 * 60 * 1000;

const getArgValue = (name: string) => {
  const prefix = `--${name}=`;
  const inlineArg = process.argv.find((arg) => arg.startsWith(prefix));

  if (inlineArg) return inlineArg.slice(prefix.length);

  const argIndex = process.argv.findIndex((arg) => arg === `--${name}`);

  return argIndex >= 0 ? process.argv[argIndex + 1] : undefined;
};

const getNumberArg = (name: string, defaultValue: number) => {
  const value = getArgValue(name);

  if (value === undefined) return defaultValue;

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw new Error(`Invalid --${name}. Expected a positive number.`);
  }

  return parsedValue;
};

const getDryRunMode = () => {
  const isDryRun = process.argv.includes('--dry-run');
  const isRun = process.argv.includes('--run');

  if (isDryRun && isRun) {
    throw new Error('Use either --dry-run or --run, not both.');
  }

  return !isRun;
};

const printCleanupResult = ({
  candidates,
  candidatesCount,
  cutoff,
  deletedCount,
  dryRun,
  failedCount,
  failures,
  limit,
  olderThanMs,
}: CleanupPendingMediaAssetsResult) => {
  console.log(
    [
      `Media cleanup ${dryRun ? 'dry-run' : 'run'} completed.`,
      `Cutoff: ${cutoff}`,
      `Older than: ${Math.round(olderThanMs / MS_IN_HOUR)} hours`,
      `Limit: ${limit}`,
      `Candidates: ${candidatesCount}`,
      `Deleted: ${deletedCount}`,
      `Failed: ${failedCount}`,
    ].join('\n'),
  );

  if (candidates.length > 0) {
    console.table(
      candidates.map((asset) => ({
        createdAt: asset.createdAt,
        fileId: asset.fileId,
        filePath: asset.filePath,
        purpose: asset.purpose,
      })),
    );
  }

  if (failures.length > 0) {
    console.table(
      failures.map((failure) => ({
        fileId: failure.fileId,
        filePath: failure.filePath,
        message: failure.message,
        purpose: failure.purpose,
      })),
    );
  }
};

const runCleanup = async () => {
  const olderThanHours = getNumberArg(
    'older-than-hours',
    DEFAULT_OLDER_THAN_HOURS,
  );
  const limit = Math.floor(getNumberArg('limit', DEFAULT_LIMIT));
  const dryRun = getDryRunMode();

  await mongoose.connect(MONGO_URI);

  const result = await cleanupPendingMediaAssets({
    dryRun,
    limit,
    olderThanMs: olderThanHours * MS_IN_HOUR,
  });

  printCleanupResult(result);
};

runCleanup()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
