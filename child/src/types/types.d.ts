interface ProgrammeObject {
  title: string;
  description: string;
  pictureId: string;
  id: number;
  audioQuestion?: boolean;
  exerciseTitleInHeader?: boolean;
  usePictureAsAnswer?: boolean;
  url: string;
}
interface ExerciseObject {
  title: string;
  audioFilename?: string;
  text: string;
  answer: string;
  id: number;
  pictureId: number;
}

interface Database {
  public: {
    Tables: {
      responses: {
        Row: {
          pupilid: string;
          timeint: number;
          inserted_at: string;
          pid: number;
          eid: number;
          sc: number;
          dayscore: number;
          ms: number;
        };
        Insert: {
          pupilid: string;
          timeint: number;
          inserted_at?: string;
          pid: number;
          eid: number;
          sc: number;
          dayscore: number;
          ms: number;
        };
        Update: {
          pupilid?: string;
          timeint?: number;
          inserted_at?: string;
          pid?: number;
          eid?: number;
          sc?: number;
          dayscore?: number;
          ms?: number;
        };
      };
      teacherpupils: {
        Row: {
          teacherid: string;
          pupilid: string;
          dateadded: string;
        };
        Insert: {
          teacherid: string;
          pupilid: string;
          dateadded?: string;
        };
        Update: {
          teacherid?: string;
          pupilid?: string;
          dateadded?: string;
        };
      };
    };
  };
}
