interface Programme {
  title: string;
  description: string;
  pictureId: string;
  id: number;
  audioQuestion?: boolean;
  exerciseTitleInHeader?: boolean;
  usePictureAsAnswer?: boolean;
}
interface Responses {
  pupilid: string;
  timeint: number;
  inserted_at: string;
  pid: number;
  eid: number;
  sc: number;
  dayscore: number;
  ms: number;
}
