import { PlatformConfig } from '@/types/platform';
import { PLATFORMS } from '@/constants/platforms';

/**
 * 기본 플랫폼과 커스텀 플랫폼을 합쳐서 반환
 */
export function getAllPlatforms(customPlatforms: PlatformConfig[]): PlatformConfig[] {
  return [...PLATFORMS, ...customPlatforms];
}

/**
 * 플랫폼 ID로 플랫폼 정보 찾기
 */
export function getPlatformById(
  id: string,
  customPlatforms: PlatformConfig[]
): PlatformConfig | undefined {
  const allPlatforms = getAllPlatforms(customPlatforms);
  return allPlatforms.find((p) => p.id === id);
}

/**
 * 플랫폼 맵 생성 (빠른 조회용)
 */
export function getPlatformMap(
  customPlatforms: PlatformConfig[]
): Record<string, PlatformConfig> {
  const allPlatforms = getAllPlatforms(customPlatforms);
  return Object.fromEntries(allPlatforms.map((p) => [p.id, p]));
}
