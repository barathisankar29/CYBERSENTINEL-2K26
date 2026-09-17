import type { CityPosition } from '@/types/navigation'

/**
 * Named camera states for the intro -> aerial city transition. Kept as
 * data so camera positions/timing can be tuned per breakpoint without
 * touching the components that consume them.
 */
export type CameraState = 'intro' | 'cityRising' | 'aerial'

export interface CameraKeyframe {
  state: CameraState
  desktop: CityPosition
  mobile: CityPosition
}

// TODO: real keyframe values land once the city scene's coordinate space is defined.
export const cameraKeyframes: CameraKeyframe[] = []
