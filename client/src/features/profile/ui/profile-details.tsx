import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { User } from '../../../entities/user';
import {
  deleteImageFromImageKit,
  type UploadedMediaAsset,
} from '../../../shared/api';
import { Button, TextInput } from '../../../shared/ui';
import type { UpdateProfilePayload } from '../api';
import { ProfileAvatarUploadField } from './profile-avatar-upload-field';

type ProfileDetailsProps = {
  error?: string | null;
  isSubmitting?: boolean;
  successMessage?: string | null;
  user: User;
  onSubmit?: (payload: UpdateProfilePayload) => void;
};

const getEmailVerificationLabel = (isEmailVerified: boolean) => {
  return isEmailVerified ? 'Verified' : 'Not verified yet';
};

const getUserAvatarAsset = (user: User): UploadedMediaAsset | null => {
  if (!user.avatarUrl || !user.avatarFileId || !user.avatarFilePath) {
    return null;
  }

  return {
    fileId: user.avatarFileId,
    filePath: user.avatarFilePath,
    fileType: 'image',
    name: 'Profile photo',
    size: 0,
    url: user.avatarUrl,
  };
};

const avatarPreviewStyle = (url: string) => ({
  backgroundImage: `url("${url}")`,
  borderRadius: '9999px',
  clipPath: 'circle(50% at 50% 50%)',
});

export const ProfileDetails = ({
  error,
  isSubmitting = false,
  onSubmit,
  successMessage,
  user,
}: ProfileDetailsProps) => {
  const [avatarAsset, setAvatarAsset] = useState<UploadedMediaAsset | null>(
    () => getUserAvatarAsset(user),
  );
  const [name, setName] = useState(user.name);
  const [cleanupError, setCleanupError] = useState<string | null>(null);
  const avatarAssetRef = useRef<UploadedMediaAsset | null>(avatarAsset);
  const persistedAvatarFileIdRef = useRef<string | null>(
    user.avatarFileId ?? null,
  );
  const isMountedRef = useRef(false);
  const isSubmittingRef = useRef(isSubmitting);
  const googleAvatarUrl =
    user.avatarUrl && !user.avatarFileId ? user.avatarUrl : null;
  const hasNameChanged = name.trim() !== user.name;
  const hasAvatarChanged =
    (avatarAsset?.fileId ?? null) !== (user.avatarFileId ?? null);
  const canSubmit = Boolean(onSubmit) && (hasNameChanged || hasAvatarChanged);
  const avatarPayload = useMemo<UpdateProfilePayload['avatar']>(() => {
    if (!avatarAsset) return null;

    return {
      fileId: avatarAsset.fileId,
      filePath: avatarAsset.filePath,
      url: avatarAsset.url,
    };
  }, [avatarAsset]);

  const cleanupTemporaryAvatarAsset = useCallback(
    async (
      asset: UploadedMediaAsset | null,
      persistedFileId: string | null,
      options: { showError?: boolean } = {},
    ) => {
      if (!asset || asset.fileId === persistedFileId) return;

      try {
        const response = await deleteImageFromImageKit(asset.fileId);

        if (
          !response.success &&
          isMountedRef.current &&
          options.showError !== false
        ) {
          setCleanupError(response.message);
        }
      } catch (cleanupError) {
        if (!isMountedRef.current || options.showError === false) return;

        setCleanupError(
          cleanupError instanceof Error
            ? cleanupError.message
            : 'Failed to clean up previous avatar upload',
        );
      }
    },
    [],
  );

  useEffect(() => {
    const previousAvatarAsset = avatarAssetRef.current;
    const previousPersistedAvatarFileId = persistedAvatarFileIdRef.current;
    const nextAvatarAsset = getUserAvatarAsset(user);

    setName(user.name);
    setAvatarAsset(nextAvatarAsset);
    setCleanupError(null);
    avatarAssetRef.current = nextAvatarAsset;
    persistedAvatarFileIdRef.current = user.avatarFileId ?? null;

    if (
      previousAvatarAsset?.fileId &&
      previousAvatarAsset.fileId !== previousPersistedAvatarFileId &&
      previousAvatarAsset.fileId !== nextAvatarAsset?.fileId
    ) {
      void cleanupTemporaryAvatarAsset(
        previousAvatarAsset,
        previousPersistedAvatarFileId,
      );
    }
  }, [cleanupTemporaryAvatarAsset, user]);

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (isSubmittingRef.current) return;

      void cleanupTemporaryAvatarAsset(
        avatarAssetRef.current,
        persistedAvatarFileIdRef.current,
        { showError: false },
      );
    };
  }, [cleanupTemporaryAvatarAsset]);

  const handleAvatarChange = (nextAvatarAsset: UploadedMediaAsset | null) => {
    const previousAvatarAsset = avatarAssetRef.current;
    const persistedAvatarFileId = persistedAvatarFileIdRef.current;

    setCleanupError(null);
    setAvatarAsset(nextAvatarAsset);
    avatarAssetRef.current = nextAvatarAsset;

    if (
      previousAvatarAsset?.fileId &&
      previousAvatarAsset.fileId !== nextAvatarAsset?.fileId
    ) {
      void cleanupTemporaryAvatarAsset(
        previousAvatarAsset,
        persistedAvatarFileId,
      );
    }
  };

  const handleSubmit = () => {
    if (!onSubmit || !canSubmit || isSubmitting) return;

    onSubmit({
      ...(hasNameChanged ? { name: name.trim() } : {}),
      ...(hasAvatarChanged ? { avatar: avatarPayload } : {}),
    });
  };

  const handleReset = () => {
    const previousAvatarAsset = avatarAssetRef.current;
    const persistedAvatarFileId = persistedAvatarFileIdRef.current;
    const nextAvatarAsset = getUserAvatarAsset(user);

    setName(user.name);
    setAvatarAsset(nextAvatarAsset);
    setCleanupError(null);
    avatarAssetRef.current = nextAvatarAsset;

    if (previousAvatarAsset?.fileId !== nextAvatarAsset?.fileId) {
      void cleanupTemporaryAvatarAsset(
        previousAvatarAsset,
        persistedAvatarFileId,
      );
    }
  };

  return (
    <section className="grid gap-4 border-y border-border-strong py-6 md:grid-cols-2">
      <div className="flex flex-col gap-4 md:col-span-2">
        {googleAvatarUrl && !avatarAsset && (
          <div className="flex items-center gap-3">
            <div
              role="img"
              aria-label={user.name}
              className="size-16 shrink-0 overflow-hidden border border-border-soft bg-background-secondary bg-cover bg-center bg-no-repeat"
              style={avatarPreviewStyle(googleAvatarUrl)}
            />
            <div className="flex flex-col gap-1">
              <span className="block-small text-typography-secondary">
                Google profile photo
              </span>
              <span className="block-small text-typography-muted">
                Upload a custom photo to replace it.
              </span>
            </div>
          </div>
        )}
        <ProfileAvatarUploadField
          error={cleanupError ?? undefined}
          value={avatarAsset}
          onChange={handleAvatarChange}
        />
      </div>

      <div className="flex flex-col gap-1">
        <TextInput
          id="profile-name"
          label="Name"
          value={name}
          onChange={setName}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="block-small text-typography-secondary">Email</span>
        <span className="block-medium break-all text-typography-heading">
          {user.email}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="block-small text-typography-secondary">Role</span>
        <span className="block-medium capitalize text-typography-heading">
          {user.role}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="block-small text-typography-secondary">
          Email status
        </span>
        <span className="block-medium text-typography-heading">
          {getEmailVerificationLabel(user.isEmailVerified)}
        </span>
      </div>

      {(error || successMessage || onSubmit) && (
        <div className="flex flex-col gap-3 md:col-span-2">
          {error && (
            <p className="block-small text-accent-secondary">{error}</p>
          )}
          {successMessage && !error && (
            <p className="block-small text-typography-secondary">
              {successMessage}
            </p>
          )}
          {onSubmit && (
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={!canSubmit || isSubmitting}
                variant="primary"
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Saving...' : 'Save profile'}
              </Button>
              <Button
                disabled={!canSubmit || isSubmitting}
                variant="secondary"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
