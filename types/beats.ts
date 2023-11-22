export type CameraAngle = 'ANGLE1' | 'ANGLE2' | 'ANGLE3';

export interface Beat {
  id: number
  description: string;
  duration: number;
  cameraAngle: CameraAngle;
}